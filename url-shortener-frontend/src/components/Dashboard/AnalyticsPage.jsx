
import { useQuery } from "@tanstack/react-query";
import { FaLink, FaMousePointer } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

import { getUrlAnalytics } from "../../service/analyticsService";
import { getShortUrlById } from "../../service/urlService";
import { getDateBefore } from "../../utils/analyticsDateUtils";
import { getShortUrl } from "../../utils/urlUtils";

import AnalyticsCard from "./AnalyticsCard";
import AnalyticsLineChart from "./AnalyticsLineChart";
import MetricCard from "./MetricCard";

const AnalyticsPage = () => {
  const navigate = useNavigate();

  // Read the selected URL's ID from the route.
  const { id } = useParams();

  // Define the last 30 days, including today.
  const startDate = getDateBefore(29);
  const endDate = getDateBefore(0);

  // Fetch and cache the selected URL's details.
  const {
    data: url,
    isLoading: isUrlLoading,
    isError: isUrlError,
  } = useQuery({
    // Each URL has its own cached details.
    queryKey: ["url", id],
    queryFn: () => getShortUrlById(id),

    // Wait until a valid URL ID is available.
    enabled: Boolean(id),
  });

  // Extracts the short code from "git123" or "http://localhost:8080/git123"
  const shortCode = url?.shortUrl?.split("/").pop();

  // Fetch and cache daily click analytics for this short URL.
  const {
    data: analyticsData = [],
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useQuery({
    // Cache analytics separately for each URL and date range.
    queryKey: ["urlAnalytics", shortCode, startDate, endDate],
    queryFn: () => getUrlAnalytics(shortCode, startDate, endDate),

    // Fetch analytics only after the short code is available.
    enabled: Boolean(shortCode),
  });

  // Show a loading message while the URL details are fetched.
  if (isUrlLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Show an error message if the URL details could not be loaded.
  if (isUrlError || !url) {
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

  // Build the complete, clickable short URL.
  const shortLink = getShortUrl(shortCode);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      {/* Navigate back to the Dashboard. */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <FaArrowLeft />
        Back to Dashboard
      </button>

      {/* Display the selected short URL and its original URL. */}
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

        <p className="mt-1 break-all text-sm text-gray-500">
          {url.originalUrl}
        </p>
      </div>

      {/* Display the total click count and URL creation date. */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MetricCard
          icon={<FaMousePointer />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          label="Total Clicks"
          value={url.clickCount ?? 0}
        />

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

      {/* Display daily click analytics for the selected URL. */}
      <AnalyticsCard
        title="Click Analytics"
        subtitle="Click activity for this short link over the last 30 days."
      >
        {isAnalyticsLoading ? (
          <p className="py-10 text-center text-gray-500">
            Loading analytics...
          </p>
        ) : isAnalyticsError ? (
          <p className="py-10 text-center text-red-500">
            Unable to load click analytics.
          </p>
        ) : analyticsData.length > 0 ? (
          <AnalyticsLineChart data={analyticsData} />
        ) : (
          <p className="py-10 text-center text-gray-500">
            No click analytics available for this period.
          </p>
        )}
      </AnalyticsCard>
    </div>
  );
};

export default AnalyticsPage;
