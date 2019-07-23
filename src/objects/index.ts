import Blob from './blob';

export const createBlob = (file: string): Blob => {
  return Blob.create(file);
}
