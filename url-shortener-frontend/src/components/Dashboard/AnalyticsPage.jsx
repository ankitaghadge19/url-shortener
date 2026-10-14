import { useCallback, useEffect, useState } from "react";
import { FaLink, FaMousePointer } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

import { getUrlAnalytics } from "../../service/analyticsService";
import { getShortUrlById } from "../../service/urlService";
import { getShortUrl } from "../../utils/urlUtils";

import AnalyticsCard from "./AnalyticsCard";
import AnalyticsLineChart from "./AnalyticsLineChart";
import MetricCard from "./MetricCard";
import { getDateBefore } from "../../utils/analyticsDateUtils";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Stores details of the selected short URL
  const [url, setUrl] = useState(null);

  // Stores daily click data for the analytics chart
  const [analyticsData, setAnalyticsData] = useState([]);

  // Tracks whether the URL details and analytics are loading
  const [loading, setLoading] = useState(true);

  // Fetches the selected URL details and its daily click analytics
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      // Define the date range for the last 30 days, including today
      const endDate = getDateBefore(0);
      const startDate = getDateBefore(29);

      // Fetch URL details, including its total click count
      const urlData = await getShortUrlById(id);
      setUrl(urlData);

      // Extracts the short code from "git123" or "http://localhost:8080/git123"
      const shortCode = urlData.shortUrl.split("/").pop();

      // Fetch daily click statistics for this short URL
      const data = await getUrlAnalytics(
        shortCode,
        startDate,
        endDate
      );

      // Store the API response directly
      // Expected format: [{ date: "2026-10-09", clicks: 3 }, ...]
      setAnalyticsData(data);
    } catch (error) {
      console.error("Unable to load URL analytics:", error);
    } finally {
      // Stop the loading indicator after the requests finish.
      setLoading(false);
    }
  }, [id]);

  // Load analytics initially and refresh when the browser tab regains focus
  useEffect(() => {
    loadAnalytics();

    // Refresh the data when the user returns to this browser tab
    const handleFocus = () => {
      loadAnalytics();
    };

    window.addEventListener("focus", handleFocus);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadAnalytics]);

  // Show a loading message while the URL details are being fetched
  if (loading && !url) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Show an error message if the URL details could not be loaded
  if (!url) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center">
        <p className="text-gray-500">
          Unable to load URL analytics.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Build the complete, clickable short URL
  const shortCode = url.shortUrl.split("/").pop();
  const shortLink = getShortUrl(shortCode);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div>
        {/* Navigate back to the dashboard. */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        {/* Display the page title and short URL details */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Link Analytics
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <FaLink className="shrink-0 text-gray-400" />

            <a
              href={shortLink}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-medium text-blue-600 hover:underline"
            >
              {shortLink}
            </a>
          </div>

          {/* Display the original destination URL */}
          <p className="mt-1 break-all text-sm text-gray-500">
            {url.originalUrl}
          </p>
        </div>

        {/* Display summary metrics for this short URL */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Total clicks recorded for this URL */}
          <MetricCard
            icon={<FaMousePointer />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Total Clicks"
            value={url.clickCount ?? 0}
          />

          {/* Date when this short URL was created */}
          <MetricCard
            icon={<FaLink />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Created At"
            value={
              url.createdAt
                ? new Date(url.createdAt).toLocaleDateString()
                : "N/A"
            }
          />
        </div>

        {/* Display daily click activity for the selected short URL */}
        <AnalyticsCard
          title="Click Analytics"
          subtitle="Click activity for this short link over the last 30 days."
        >
          {loading ? (
            // Show feedback while analytics are refreshing.
            <p className="py-10 text-center text-sm text-gray-500">
              Refreshing analytics...
            </p>
          ) : analyticsData.length > 0 ? (
            // Render the chart when daily click data is available
            <AnalyticsLineChart data={analyticsData} />
          ) : (
            // Show an empty state when no daily click data is available
            <p className="py-10 text-center text-sm text-gray-500">
              No click analytics available for this period.
            </p>
          )}
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;