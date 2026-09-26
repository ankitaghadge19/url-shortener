import { useState } from "react";
import {
  FaChartLine,
  FaLink,
  FaMousePointer,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

import { analyticsData, shortUrls } from "../../dummyData/Data";
import AnalyticsLineChart from "./AnalyticsLineChart";
import CreateShortUrlModal from "./CreateShortUrlModal";
import ShortUrlCard from "./ShortUrlCard";

const DashboardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredUrls = shortUrls.filter((url) => {
    const search = searchTerm.toLowerCase();

    return (
      url.shortUrl.toLowerCase().includes(search) ||
      url.originalUrl.toLowerCase().includes(search)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage your links and track their performance.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-custom-gradient
              text-white
              rounded-lg
              px-4
              py-3
              font-medium
              cursor-pointer
              hover:opacity-90
              transition
            "
          >
            <FaPlus />
            Create Short URL
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {/* Total Short Links */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-5">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <FaLink className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Short Links</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {shortUrls.length}
                </h2>
              </div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <FaMousePointer className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Clicks</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {shortUrls.reduce((total, url) => total + url.clicks, 0)}
                </h2>
              </div>
            </div>
          </div>

          {/* Average Clicks */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-5">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Clicks / Link</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {shortUrls.length > 0
                    ? Math.round(
                        shortUrls.reduce(
                          (total, url) => total + url.clicks,
                          0,
                        ) / shortUrls.length,
                      )
                    : 0}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Analytics */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Click Analytics
              </h2>
            </div>
          </div>
          <div className="h-72">
            <AnalyticsLineChart data={analyticsData} />
          </div>
        </div>

        {/* Short URLs */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-8">
          {/* Header + Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Your Short Links
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage and monitor your shortened URLs.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <FaSearch
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search your links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  border
                  border-gray-200
                  bg-white
                  w-full
                  rounded-lg
                  py-2.5
                  pl-10
                  pr-3
                  outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          </div>

          {/* Scrollable URL List */}
          <div className="max-h-125 overflow-y-auto space-y-3 pr-1">
            {filteredUrls.length > 0 ? (
              filteredUrls.map((url) => <ShortUrlCard key={url.id} url={url} />)
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">No short links found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Short URL Modal */}
      {isCreateModalOpen && (
        <CreateShortUrlModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </main>
  );
};

export default DashboardLayout;
