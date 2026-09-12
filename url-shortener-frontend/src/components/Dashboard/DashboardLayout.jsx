import { useState } from "react";
import {
  FaChartLine,
  FaLink,
  FaMousePointer,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { analyticsData, shortUrls } from "../../dummyData/Data";
import AnalyticsLineChart from "./AnalyticsChart";
import ShortUrlCard from "./ShortUrlCard";

const DashboardLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUrls = shortUrls.filter((url) => {
    const search = searchTerm.toLowerCase();

    return (
      url.shortUrl.toLowerCase().includes(search) ||
      url.originalUrl.toLowerCase().includes(search)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <div className="">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage your links and track their performance.
            </p>
          </div>

          <button
            className="
                flex
                items-center
                justify-center
                gap-1
                bg-custom-gradient
                text-white
                rounded-lg
                px-3 py-3
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
          {/* Total Links */}
          <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-5">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <FaLink className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Short Links</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">4</h2>
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
                <h2 className="text-3xl font-bold text-gray-800 mt-2">2000</h2>
              </div>
            </div>
          </div>

          {/* Average Clicks */}
          <div className="bg-white border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex justify-center items-center">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Clicks / Link</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">500</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gary-800">
              Click Analytics
            </h2>
          </div>
          <div className="h-50 mt-5">
            <AnalyticsLineChart data={analyticsData} />
          </div>
        </div>

        {/* Short URLs */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-8">
          {/* Header + Search */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Your Short Links
              </h2>
              {/* <p className="mt-1 text-sm text-gray-500">
              Manage and monitor your shortened URLs.
            </p> */}
            </div>
            {/* Search */}
            <div className="relative w-full md:w-80">
              <FaSearch
                className="
              absolute left-3 text-gray-400
              top-1/2
              -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search your links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                border 
                border-gray-200 
                bg-white w-full rounded-lg
                py-2 pl-10
                outline-none 
                focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Scrollable URL List */}
          <div className="max-h-125 overflow-y-auto space-y-3 pr-2">
            {filteredUrls.length > 0 ? (
              filteredUrls.map((url) => <ShortUrlCard key={url.id} url={url} />)
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
