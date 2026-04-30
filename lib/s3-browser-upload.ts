/**
 * Browser PUT to a presigned S3 URL. Uses XHR for upload progress and AbortSignal.
 * Progress uses bytes sent vs file.size (S3 CORS uploads often have lengthComputable === false).
 */
export function uploadFileViaPresignedPut(
  file: File,
  uploadUrl: string,
  contentType: string,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    let lastReported = -1;
    const report = (pct: number) => {
      if (!onProgress) return;
      const p = Math.min(100, Math.max(0, Math.round(pct)));
      if (p !== lastReported) {
        lastReported = p;
        onProgress(p);
      }
    };

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);

    xhr.upload.onloadstart = () => {
      report(0);
    };

    xhr.upload.onprogress = (e) => {
      const total =
        file.size > 0
          ? file.size
          : e.lengthComputable && e.total > 0
            ? e.total
            : 0;
      if (total <= 0) return;
      report((e.loaded / total) * 100);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        report(100);
        resolve();
        return;
      }
      const snippet = (xhr.responseText || xhr.statusText || '').slice(0, 200);
      reject(new Error(`Upload failed (${xhr.status}): ${snippet}`));
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'));

    const onAbort = () => xhr.abort();
    if (signal) {
      signal.addEventListener('abort', onAbort);
    }

    xhr.send(file);

    if (signal) {
      const cleanup = () => signal.removeEventListener('abort', onAbort);
      xhr.addEventListener('loadend', cleanup);
    }
  });
}
