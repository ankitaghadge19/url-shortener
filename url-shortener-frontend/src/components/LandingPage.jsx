import { motion } from "motion/react";
import { FaChartLine, FaFolderOpen, FaLink, FaShieldAlt } from "react-icons/fa";
import FeatureCard from "./FeatureCard";

const LandingPage = () => {
  const features = [
    {
      icon: <FaLink />,
      title: "Smart URL Shortening",
      description:
        "Create short and easy-to-share links in seconds while keeping your original URL safe.",
    },
    {
      icon: <FaChartLine />,
      title: "Detailed Analytics",
      description:
        "Track clicks, daily statistics and monitor link performance with ease.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Authentication",
      description:
        "Protect user accounts with JWT authentication and encrypted passwords.",
    },
    {
      icon: <FaFolderOpen />,
      title: "Link Management",
      description:
        "Create, edit, organize and manage all your shortened URLs from one dashboard.",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-30">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* left */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-gray-800 mb-6"
          >
            Welcome to Linklytics!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 leading-7 max-w-xl"
          >
            Linklytics helps you create short, sharable URLs in seconds. Manage
            all your links from one dashboard and monitor detailed analytics to
            undestand your link performance.
          </motion.p>

          {/* buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 mt-5"
          >
            <button className="bg-custom-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 cursor-pointer">
              Manage Links
            </button>
            <button className="border border-btnColor text-btnColor px-4 py-3 rounded-lg hover:bg-blue-50 cursor-pointer">
              Create Short Link
            </button>
          </motion.div>
        </div>

        {/* right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <img
            src="/images/triangle.png"
            alt="logo"
            className="w-[400px] lg:w-[450px]"
          />
        </motion.div>
      </div>

      {/* feature cards */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Choose Linklytics?
        </h2>

        <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mt-3"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
