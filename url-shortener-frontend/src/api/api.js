import axios from "axios";

// Create a reusable Axios instance for all backend API requests.
const api = axios.create({
  // Backend base URL is configured through the frontend .env file.
  baseURL: import.meta.env.VITE_BACKEND_URL,

  // Allow cookies to be sent with requests when required by the backend.
  withCredentials: true,
});

export default api;