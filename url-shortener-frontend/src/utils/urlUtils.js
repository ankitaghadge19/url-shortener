// Create the full short URL using the backend URL and short code.
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getShortUrl = (shortCode) => {
  return `${backendUrl}/${shortCode}`;
};