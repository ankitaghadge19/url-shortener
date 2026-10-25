import api from "../api/api";

/**
 * Get total clicks across all URLs for each day within the given date range.
 */
export const getTotalClicksByDate = async (startDate, endDate) => {
  const response = await api.get("/api/urls/daily-clicks", {
    params: {
      startDate,
      endDate,
    },
  });

  return response.data;
};

/**
 * Fetch daily click analytics for a short URL within the specified date range.
 */
export const getUrlAnalytics = async (shortUrl, startDate, endDate) => {
  const response = await api.get(
    `/api/urls/analytics/daily-clicks/${encodeURIComponent(shortUrl)}`,
    {
      params: {
        startDate,
        endDate,
      },
    }
  );

  return response.data;
};