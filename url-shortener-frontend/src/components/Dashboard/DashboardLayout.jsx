import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { FaChartLine, FaLink, FaMousePointer, FaPlus } from "react-icons/fa";

import { getTotalClicksByDate } from "../../service/analyticsService";
import { getAllShortUrls } from "../../service/urlService";
import { getDateBefore } from "../../utils/analyticsDateUtils";

import AnalyticsCard from "./AnalyticsCard";
import AnalyticsLineChart from "./AnalyticsLineChart";
import CreateShortUrlModal from "./CreateShortUrlModal";
import MetricCard from "./MetricCard";
import SearchBar from "./SearchBar";
import ShortUrlCard from "./ShortUrlCard";

const DashboardLayout = () => {
  // Access the shared QueryClient to manage cached server data.
  const queryClient = useQueryClient();

  // Store the search input and modal visibility.
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Define the last 30 days, including today, for click analytics.
  const startDate = getDateBefore(29);
  const endDate = getDateBefore(0);

  // Fetch and cache all short URLs belonging to the logged-in user.
  const {
    data: shortUrls = [],
    isLoading: isUrlsLoading,
    isError: isUrlsError,
    refetch: refetchUrls,
  } = useQuery({
    queryKey: ["urls"],
    queryFn: getAllShortUrls,
  });

  // Fetch and cache daily click totals for the selected date range.
  const {
    data: analyticsData = [],
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["dailyClicks", startDate, endDate],
    queryFn: () => getTotalClicksByDate(startDate, endDate),
  });

  // Keep the search handler reference stable between renders.
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Close the modal and refresh dashboard data after successful URL creation.
  const handleShortUrlCreated = useCallback(async () => {
    setIsCreateModalOpen(false);

    // Mark both queries stale so active queries can fetch updated data.
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["urls"] }),
      queryClient.invalidateQueries({ queryKey: ["dailyClicks"] }),
    ]);
  }, [queryClient]);

  // Filter URLs only when the URLs array or search term changes.
  const filteredUrls = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return shortUrls.filter(
      (url) =>
        url.shortUrl.toLowerCase().includes(search) ||
        url.originalUrl.toLowerCase().includes(search),
    );
  }, [shortUrls, searchTerm]);

  // Calculate total clicks when the URL data changes.
  const totalClicks = useMemo(
    () => shortUrls.reduce((total, url) => total + (url.clickCount || 0), 0),
    [shortUrls],
  );

  // Calculate average clicks per URL, avoiding division by zero.
  const averageClicks = useMemo(
    () => (shortUrls.length ? Math.round(totalClicks / shortUrls.length) : 0),
    [shortUrls.length, totalClicks],
  );

  // Determine the total short links metric value.
  let totalShortLinksValue;

  if (isUrlsError) {
    totalShortLinksValue = "—";
  } else if (isUrlsLoading) {
    totalShortLinksValue = "...";
  } else {
    totalShortLinksValue = shortUrls.length;
  }

  // Determine the total clicks metric value.
  let totalClicksValue;

  if (isUrlsError) {
    totalClicksValue = "—";
  } else if (isUrlsLoading) {
    totalClicksValue = "...";
  } else {
    totalClicksValue = totalClicks;
  }

  // Determine the average clicks metric value.
  let averageClicksValue;

  if (isUrlsError) {
    averageClicksValue = "—";
  } else if (isUrlsLoading) {
    averageClicksValue = "...";
  } else {
    averageClicksValue = averageClicks;
  }

  // Determine what to display based on the analytics request state.
  let analyticsContent;

  if (isAnalyticsLoading) {
    analyticsContent = (
      <p className="py-10 text-center text-gray-500">Loading analytics...</p>
    );
  } else if (isAnalyticsError) {
    analyticsContent = (
      <div className="py-10 text-center">
        <p className="text-red-500">Unable to load analytics.</p>

        <button
          type="button"
          onClick={() => refetchAnalytics()}
          className="mt-2 text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  } else {
    analyticsContent = <AnalyticsLineChart data={analyticsData} />;
  }

  // Determine what to display based on the URL list's request state.
  let urlListContent;

  if (isUrlsLoading) {
    urlListContent = (
      <p className="py-10 text-center text-gray-500">
        Loading your short links...
      </p>
    );
  } else if (isUrlsError) {
    urlListContent = (
      <div className="py-10 text-center">
        <p className="text-red-500">Unable to load your short links.</p>

        <button
          type="button"
          onClick={() => refetchUrls()}
          className="mt-2 text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  } else if (filteredUrls.length > 0) {
    // Render a card for each URL matching the search term.
    urlListContent = filteredUrls.map((url) => (
      <ShortUrlCard key={url.id} url={url} />
    ));
  } else {
    urlListContent = (
      <p className="py-10 text-center text-gray-500">No short links found.</p>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-8xl">
        {/* Dashboard heading and create URL button. */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <p className="mt-1 text-gray-500">
              Manage your links and track their performance.
            </p>
          </div>

          <button
            type="button"
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
            value={totalShortLinksValue}
          />

          <MetricCard
            icon={<FaMousePointer />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Total Clicks"
            value={totalClicksValue}
          />

          <MetricCard
            icon={<FaChartLine />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            label="Avg. Clicks / Link"
            value={averageClicksValue}
          />
        </div>

        {/* Display daily click analytics for the selected date range. */}
        <div className="mb-8">
          <AnalyticsCard title="Click Analytics">
            {analyticsContent}
          </AnalyticsCard>
        </div>

        {/* Display the user's short URLs and search controls. */}
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Short Links
            </h2>

            <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          </div>

          {/* Display loading, error, matching URLs, or the empty state. */}
          <div className="max-h-125 space-y-3 overflow-y-auto pr-1">
            {urlListContent}
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
