import Blob from './blob';

export const createBlob = (file: string): Blob => {
  const blob = Blob.create(file);
  return blob;
}
