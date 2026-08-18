const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 text-xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mt-5 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-6">{description}</p>
    </div>
  );
};

export default FeatureCard;
