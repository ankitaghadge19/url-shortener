const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getShortUrl = (shortCode) => {
  return `${backendUrl}/${shortCode}`;
};