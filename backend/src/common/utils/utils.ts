export const generateImageUrl = (filename: string): string => {
  return `${process.env.BASE_URL}/uploads/${filename}`;
};