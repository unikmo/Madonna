import { v2 as cloudinary } from 'cloudinary';

/**
 * Configures Cloudinary with credentials from environment variables
 */
export function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      'Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET'
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}

/**
 * Uploads a file to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param folder - Optional folder path in Cloudinary
 * @param resourceType - The resource type (image, video, raw, auto)
 * @returns The uploaded file's secure URL and public ID
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'unikmo-moments',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<{ url: string; publicId: string }> {
  const cloudinaryInstance = configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryInstance.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error('Upload failed: No result returned'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Deletes a file from Cloudinary
 * @param publicId - The public ID of the file to delete (can include folder path)
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cloudinaryInstance = configureCloudinary();
  
  return new Promise((resolve, reject) => {
    cloudinaryInstance.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
