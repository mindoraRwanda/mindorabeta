import cloudinary, { CLOUDINARY_FOLDERS } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { ApiError } from '../utils/apiError';
import { compressImage } from '../utils/imageCompression';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (
  buffer: Buffer,
  folder: string,
  options: {
    compress?: boolean;
    transformation?: any;
  } = {},
): Promise<CloudinaryUploadResult> => {
  try {
    let uploadBuffer = buffer;

    // Compress image if requested
    if (options.compress !== false) {
      const compressed = await compressImage(buffer, { quality: 85 });
      uploadBuffer = compressed.buffer;
    }

    // Upload to Cloudinary
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          ...options.transformation,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        },
      );

      uploadStream.end(uploadBuffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    throw ApiError.internal('Failed to upload image');
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (buffer: Buffer): Promise<CloudinaryUploadResult> => {
  return uploadImage(buffer, CLOUDINARY_FOLDERS.AVATARS, {
    transformation: {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
    },
  });
};

/**
 * Upload exercise image
 */
export const uploadExerciseImage = async (buffer: Buffer): Promise<CloudinaryUploadResult> => {
  return uploadImage(buffer, CLOUDINARY_FOLDERS.EXERCISES);
};

/**
 * Upload post image
 */
export const uploadPostImage = async (buffer: Buffer): Promise<CloudinaryUploadResult> => {
  return uploadImage(buffer, CLOUDINARY_FOLDERS.POSTS);
};

/**
 * Upload therapist document
 */
export const uploadTherapistDocument = async (buffer: Buffer): Promise<CloudinaryUploadResult> => {
  return uploadImage(buffer, CLOUDINARY_FOLDERS.THERAPIST_DOCS, { compress: false });
};
