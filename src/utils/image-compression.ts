import { FILE_LIMIT_SIZE_MB } from '@/constants';
import imageCompression from 'browser-image-compression';

const supportedExtList = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];

export const handleImageCompression = async (file: File) => {
  const options = {
    maxSizeMB: FILE_LIMIT_SIZE_MB,
    maxWidthOrHeight: 2048,
    useWebWorker: true
  };

  if (!supportedExtList.includes(file.type)) {
    return file;
  }
  const compressionImage = await imageCompression(file, options);

  return compressionImage;
};
