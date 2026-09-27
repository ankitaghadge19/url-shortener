import { FaLink, FaMousePointer } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { analyticsData, shortUrls } from "../../data/Data";
import AnalyticsLineChart from "./AnalyticsLineChart";
import MetricCard from "./MetricCard";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = shortUrls.find((item) => item.id.toString() === id);
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-10">
      <div>
        {/* Back To Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="
          flex items-center
          gap-2 text-sm text-gray-600
          hover:text-gray-800
          mb-6
          cursor-pointer
          "
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Link Analytics</h1>
          <div className="flex items-center gap-2 mt-3">
            <FaLink className="text-gray-400" />
            <span className="font-medium text-blue-600">{url.shortUrl}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{url.originalUrl}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Total Clicks */}
          <MetricCard
            icon={<FaMousePointer />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Total Clicks"
            value={url.clicks}
          />

          {/* Created At */}
          <MetricCard
            icon={<FaLink />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Created At"
            value={url.createdAt}
          />
        </div>

        {/* Analytics */}
        <AnalyticsCard
          title="Click Analytics"
          subtitle="Click activity for this short link."
        >
          <AnalyticsLineChart data={analyticsData} />
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;
