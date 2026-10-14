
import { useCallback, useEffect, useState } from "react";
import {
  FaChartLine,
  FaLink,
  FaMousePointer,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

import { getTotalClicksByDate } from "../../service/analyticsService";
import { getAllShortUrls } from "../../service/urlService";
import AnalyticsCard from "./AnalyticsCard";
import AnalyticsLineChart from "./AnalyticsLineChart";
import CreateShortUrlModal from "./CreateShortUrlModal";
import MetricCard from "./MetricCard";
import ShortUrlCard from "./ShortUrlCard";
import { getDateBefore } from "../../utils/analyticsDateUtils";

const DashboardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shortUrls, setShortUrls] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);

  // Fetch all short URLs for the logged-in user
  const loadShortUrls = useCallback(async () => {
    try {
      const data = await getAllShortUrls();
      setShortUrls(data);
    } catch (error) {
      console.error("Failed to load short URLs:", error);
    }
  }, []);

  // Fetch click analytics for the last 30 days
  const loadAnalytics = useCallback(async () => {
    try {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = getDateBefore(29);

      const data = await getTotalClicksByDate(startDate, endDate);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  }, []);

  // Refresh all dashboard data
  const loadDashboardData = useCallback(async () => {
    await Promise.all([loadShortUrls(), loadAnalytics()]);
  }, [loadShortUrls, loadAnalytics]);

  // Load data on initial render and whenever the tab regains focus
  useEffect(() => {
    loadDashboardData();

    const handleFocus = () => {
      loadDashboardData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadDashboardData]);

  // Filter short URLs based on the search term
  const filteredUrls = shortUrls.filter((url) => {
    const search = searchTerm.toLowerCase();

    return (
      url.shortUrl.toLowerCase().includes(search) ||
      url.originalUrl.toLowerCase().includes(search)
    );
  });

  // Refresh dashboard after creating a short URL
  const handleShortUrlCreated = async () => {
    setIsCreateModalOpen(false);
    await loadDashboardData();
  };

  // Calculate dashboard metrics from the latest URL data
  const totalClicks = shortUrls.reduce(
    (total, url) => total + (url.clickCount || 0),
    0
  );

  const averageClicks =
    shortUrls.length > 0
      ? Math.round(totalClicks / shortUrls.length)
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-3 sm:px-6 lg:px-10 py-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your links and track their performance.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="
              flex items-center justify-center gap-2
              bg-custom-gradient text-white rounded-lg
              px-4 py-3 font-medium cursor-pointer
              hover:opacity-90 transition
            "
          >
            <FaPlus />
            Create Short URL
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <MetricCard
            icon={<FaLink />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Total ShortLinks"
            value={shortUrls.length}
          />

          <MetricCard
            icon={<FaMousePointer />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Total Clicks"
            value={totalClicks}
          />

          <MetricCard
            icon={<FaChartLine />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            label="Avg. Clicks / Link"
            value={averageClicks}
          />
        </div>

        {/* Overall Analytics */}
        <div className="mb-8">
          <AnalyticsCard title="Click Analytics">
            <AnalyticsLineChart data={analyticsData} />
          </AnalyticsCard>
        </div>

        {/* Short URLs */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-8">
          {/* Header + Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Your Short Links
              </h2>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <FaSearch
                className="
                  absolute left-3 top-1/2 -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search your links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  border border-gray-200 bg-white w-full
                  rounded-lg py-2.5 pl-10 pr-3 outline-none
                  focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                "
              />
            </div>
          </div>

          {/* Scrollable URL List */}
          <div className="max-h-125 overflow-y-auto space-y-3 pr-1">
            {filteredUrls.length > 0 ? (
              filteredUrls.map((url) => (
                <ShortUrlCard key={url.id} url={url} />
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">
                  No short links found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Short URL Modal */}
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
