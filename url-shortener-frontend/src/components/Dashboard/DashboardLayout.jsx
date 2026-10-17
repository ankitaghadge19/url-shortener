
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaChartLine,
  FaLink,
  FaMousePointer,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

import { getTotalClicksByDate } from "../../service/analyticsService";
import { getAllShortUrls } from "../../service/urlService";
import { getDateBefore } from "../../utils/analyticsDateUtils";

import AnalyticsCard from "./AnalyticsCard";
import AnalyticsLineChart from "./AnalyticsLineChart";
import CreateShortUrlModal from "./CreateShortUrlModal";
import MetricCard from "./MetricCard";
import ShortUrlCard from "./ShortUrlCard";

const DashboardLayout = () => {
  // Access the shared QueryClient to invalidate cached data when needed.
  const queryClient = useQueryClient();

  // Store the search input and modal visibility.
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Define the last 30 days, including today.
  const startDate = getDateBefore(29);
  const endDate = getDateBefore(0);

  // Fetch and cache all short URLs belonging to the logged-in user.
  const {
    data: shortUrls = [],
    isLoading: isUrlsLoading,
    isError: isUrlsError,
  } = useQuery({
    // React Query uses this key to identify the URL list in its cache.
    queryKey: ["urls"],
    queryFn: getAllShortUrls,
  });

  // Fetch and cache overall click analytics for the selected date range.
  const {
    data: analyticsData = [],
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useQuery({
    // Different date ranges have separate cached analytics.
    queryKey: ["dailyClicks", startDate, endDate],
    queryFn: () => getTotalClicksByDate(startDate, endDate),
  });

  // Refresh dashboard data after a short URL is successfully created.
  const handleShortUrlCreated = async () => {
    setIsCreateModalOpen(false);

    // Mark both queries stale and refetch them if they are active.
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["urls"] }),
      queryClient.invalidateQueries({ queryKey: ["dailyClicks"] }),
    ]);
  };

  // Filter URLs by their short URL or original destination URL.
  const search = searchTerm.toLowerCase();
  const filteredUrls = shortUrls.filter(
    (url) =>
      url.shortUrl.toLowerCase().includes(search) ||
      url.originalUrl.toLowerCase().includes(search)
  );

  // Calculate total clicks across all URLs.
  const totalClicks = shortUrls.reduce(
    (total, url) => total + (url.clickCount || 0),
    0
  );

  // Calculate the average number of clicks per short URL.
  const averageClicks = shortUrls.length
    ? Math.round(totalClicks / shortUrls.length)
    : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-8xl">
        {/* Dashboard heading and create URL button. */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="mt-1 text-gray-500">
              Manage your links and track their performance.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-custom-gradient px-4 py-3 font-medium text-white transition hover:opacity-90"
          >
            <FaPlus />
            Create Short URL
          </button>
        </div>

        {/* Display summary metrics calculated from the URL list. */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            icon={<FaLink />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Total ShortLinks"
            value={isUrlsLoading ? "..." : shortUrls.length}
          />

          <MetricCard
            icon={<FaMousePointer />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Total Clicks"
            value={isUrlsLoading ? "..." : totalClicks}
          />

          <MetricCard
            icon={<FaChartLine />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            label="Avg. Clicks / Link"
            value={isUrlsLoading ? "..." : averageClicks}
          />
        </div>

        {/* Line graph of overall daily clicks of all short urls. */}
        <div className="mb-8">
          <AnalyticsCard title="Click Analytics">
            {isAnalyticsLoading ? (
              <p className="py-10 text-center text-gray-500">
                Loading analytics...
              </p>
            ) : isAnalyticsError ? (
              <p className="py-10 text-center text-red-500">
                Unable to load analytics.
              </p>
            ) : (
              <AnalyticsLineChart data={analyticsData} />
            )}
          </AnalyticsCard>
        </div>

        {/* Display the user's short URLs and search controls. */}
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Short Links
            </h2>

            {/* Update the search term as the user types. */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search your links..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Show the filtered URLs. */}
          <div className="max-h-125 space-y-3 overflow-y-auto pr-1">
            {isUrlsLoading ? (
              <p className="py-10 text-center text-gray-500">
                Loading your short links...
              </p>
            ) : isUrlsError ? (
              <p className="py-10 text-center text-red-500">
                Unable to load your short links.
              </p>
            ) : filteredUrls.length > 0 ? (
              filteredUrls.map((url) => (
                <ShortUrlCard key={url.id} url={url} />
              ))
            ) : (
              <p className="py-10 text-center text-gray-500">
                No short links found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Render the create URL modal only while it is open. */}
      {isCreateModalOpen && (
        <CreateShortUrlModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleShortUrlCreated}
        />
      )}
    </main>
  );
};

export default DashboardLayout;
