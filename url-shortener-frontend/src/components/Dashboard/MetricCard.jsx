const MetricCard = ({ icon, iconBg, iconColor, label, value }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-5">
        <div
          className={`
            ${iconBg}
            w-16 
            h-16 
            rounded-xl 
            flex 
            items-center 
            justify-center
        `}
        >
          <span className={`${iconColor} text-xl`}>{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
