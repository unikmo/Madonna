export type CloudinarySignedUploadParams = {
  cloudName: string;
  apiKey: string;
  timestamp: number | string;
  signature: string;
  folder: string;
};

type UploadOptions = {
  file: File;
  signed: CloudinarySignedUploadParams;
  signal?: AbortSignal;
  onProgress?: (percent: number) => void;
};

const CHUNK_THRESHOLD_BYTES = 95 * 1024 * 1024; // switch to chunking near Cloudinary single-request ceiling
const CHUNK_SIZE_BYTES = 20 * 1024 * 1024;

function buildFormData(fileOrChunk: Blob, signed: CloudinarySignedUploadParams): FormData {
  const form = new FormData();
  form.append('file', fileOrChunk);
  form.append('api_key', signed.apiKey);
  form.append('timestamp', String(signed.timestamp));
  form.append('signature', signed.signature);
  form.append('folder', signed.folder);
  return form;
}

export async function uploadToCloudinaryBrowser({
  file,
  signed,
  signal,
  onProgress,
}: UploadOptions): Promise<{ secure_url: string; public_id: string }> {
  const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`;

  // Small files: single request
  if (file.size <= CHUNK_THRESHOLD_BYTES) {
    onProgress?.(20);
    const res = await fetch(endpoint, {
      method: 'POST',
      body: buildFormData(file, signed),
      signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudinary upload failed (${res.status}): ${text.slice(0, 180)}`);
    }
    onProgress?.(95);
    const data = await res.json();
    if (!data?.secure_url || !data?.public_id) {
      throw new Error('Cloudinary upload finished but no file URL was returned');
    }
    onProgress?.(100);
    return data;
  }

  // Large files: chunked upload
  const uploadId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  let lastPayload: any = null;
  let uploaded = 0;

  for (let start = 0; start < file.size; start += CHUNK_SIZE_BYTES) {
    const endExclusive = Math.min(start + CHUNK_SIZE_BYTES, file.size);
    const chunk = file.slice(start, endExclusive);

    const res = await fetch(endpoint, {
      method: 'POST',
      body: buildFormData(chunk, signed),
      signal,
      headers: {
        'X-Unique-Upload-Id': uploadId,
        'Content-Range': `bytes ${start}-${endExclusive - 1}/${file.size}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudinary chunk upload failed (${res.status}): ${text.slice(0, 180)}`);
    }

    lastPayload = await res.json();
    uploaded = endExclusive;
    const chunkPct = Math.floor((uploaded / file.size) * 100);
    // keep UI responsive in long uploads
    onProgress?.(Math.min(99, Math.max(20, chunkPct)));
  }

  if (!lastPayload?.secure_url || !lastPayload?.public_id) {
    throw new Error('Cloudinary chunked upload finished but no file URL was returned');
  }

  onProgress?.(100);
  return lastPayload;
}

