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
  // Provides navigation back to the Dashboard.
  const navigate = useNavigate();

  // Read the selected URL ID from the current route.
  const { id } = useParams();

  // Define the last 30 calendar days, including today.
  const startDate = getDateBefore(29);
  const endDate = getDateBefore(0);

  // Fetch the selected URL's details using its ID.
  const {
    data: url,
    isLoading: isUrlLoading,
    isError: isUrlError,
  } = useQuery({
    queryKey: ["url", id],
    queryFn: () => getShortUrlById(id),

    // Run the query only when a URL ID is available.
    enabled: Boolean(id),
  });

  // Extract the short code from the complete short URL.
  const shortCode = url?.shortUrl?.split("/").pop();

  // Fetch daily click analytics for this short URL and date range.
  const {
    data: analyticsData = [],
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["urlAnalytics", shortCode, startDate, endDate],
    queryFn: () => getUrlAnalytics(shortCode, startDate, endDate),

    // Wait until the short code is available before fetching analytics.
    enabled: Boolean(shortCode),
  });

  // Show a loading state while the URL details are being fetched.
  if (isUrlLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Stop rendering the page if the URL details could not be loaded.
  if (isUrlError || !url) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center">
        <p className="text-gray-500">Unable to load URL analytics.</p>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Build the complete, clickable short URL from its short code.
  const shortLink = getShortUrl(shortCode);

  // Determine which content to display based on the analytics request state.
  let analyticsContent;

  if (isAnalyticsLoading) {
    // Show a loading message while analytics are being fetched.
    analyticsContent = (
      <p className="py-10 text-center text-gray-500">Loading analytics...</p>
    );
  } else if (isAnalyticsError) {
    // Display an error message and allow the user to retry the request.
    analyticsContent = (
      <div className="py-10 text-center">
        <p className="text-red-500">Unable to load click analytics.</p>

        <button
          type="button"
          onClick={() => refetchAnalytics()}
          className="mt-2 text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  } else if (analyticsData.length > 0) {
    // Render the chart when analytics records are available.
    analyticsContent = <AnalyticsLineChart data={analyticsData} />;
  } else {
    // Display a message when no analytics records exist for this period.
    analyticsContent = (
      <p className="py-10 text-center text-gray-500">
        No click analytics available for this period.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      {/* Navigate back to the Dashboard. */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <FaArrowLeft />
        Back to Dashboard
      </button>

      {/* Display the selected short URL and its original destination. */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Link Analytics</h1>

        <div className="mt-3 flex items-center gap-2">
          <FaLink className="shrink-0 text-gray-400" />

          {/* Open the short URL in a new tab. */}
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

      {/* Display summary metrics for the selected URL. */}
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
            url.createdAt ? new Date(url.createdAt).toLocaleDateString() : "N/A"
          }
        />
      </div>

      {/* Display analytics content based on the request state. */}
      <AnalyticsCard title="Click Analytics">{analyticsContent}</AnalyticsCard>
    </div>
  );
};

export default AnalyticsPage;
