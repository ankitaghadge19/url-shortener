import api from "../api/api";

/** 
 * Get all short URLs created by the logged-in-user
 */
export const getAllShortUrls = async () => {
    const response = await api.get("/api/urls");
    return response.data;
}

/**
 * Get a short URL by ID
 */
export const getShortUrlById = async (id) => {
    const response = await api.get(`/api/urls/${id}`);
    return response.data;
}

/**
 * Create a new short URL
 */
export const createShortUrl = async (originalUrl) => {
    const response = await api.post("/api/urls/shorten", { originalUrl });
    return response.data;   
}