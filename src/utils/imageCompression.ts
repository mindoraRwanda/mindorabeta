import sharp from 'sharp';
import { Buffer } from 'buffer';

export interface ImageCompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface CompressedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Compress and resize an image
 */
export const compressImage = async (
  inputBuffer: Buffer,
  options: ImageCompressionOptions = {},
): Promise<CompressedImage> => {
  const { quality = 80, maxWidth = 1920, maxHeight = 1080, format = 'webp' } = options;

  let pipeline = sharp(inputBuffer).rotate(); // Auto-rotate based on EXIF

  // Resize if needed
  pipeline = pipeline.resize(maxWidth, maxHeight, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  // Convert to desired format
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
      break;
    case 'webp':
    default:
      pipeline = pipeline.webp({ quality });
      break;
  }

  const buffer = await pipeline.toBuffer();
  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    format: metadata.format || format,
    width: metadata.width || 0,
    height: metadata.height || 0,
    size: buffer.length,
  };
};

/**
 * Generate multiple sizes of an image (thumbnail, medium, large)
 */
export const generateImageSizes = async (
  inputBuffer: Buffer,
): Promise<{
  thumbnail: CompressedImage;
  medium: CompressedImage;
  large: CompressedImage;
}> => {
  const [thumbnail, medium, large] = await Promise.all([
    compressImage(inputBuffer, { maxWidth: 200, maxHeight: 200, quality: 70 }),
    compressImage(inputBuffer, { maxWidth: 800, maxHeight: 800, quality: 80 }),
    compressImage(inputBuffer, { maxWidth: 1920, maxHeight: 1080, quality: 85 }),
  ]);

  return { thumbnail, medium, large };
};
