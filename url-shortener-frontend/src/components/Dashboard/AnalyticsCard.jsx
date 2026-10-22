const AnalyticsCard = ({ title, children }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-8">
      {/* Display the card heading passed through the title prop */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
      </div>

      {/* Render the content passed between the AnalyticsCard tags, such as a chart */}
      <div className="h-72">{children}</div>
    </div>
  );
};

export default AnalyticsCard;