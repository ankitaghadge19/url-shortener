import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaCopy,
  FaExternalLinkAlt,
  FaLink,
  FaMousePointer,
} from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ShortUrlCard = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      toast.success("Short URL copied!");
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Unable to copy URL");
    }
  };

  const handleAnalytics = () => {
    navigate(`/analytics/${url.id}`);
  };

  return (
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-[auto_1.8fr_0.7fr_0.9fr_auto_auto]
        items-center
        border
        border-gray-200
        rounded-xl
        gap-5
        bg-white
        shadow-sm
        px-4
        py-3
      "
    >
      {/* Link Icon */}
      <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center">
        <FaLink className="text-blue-600" />
      </div>

      {/* URL Information */}
      <div className="">
        <div className="flex items-center gap-2">
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="
              font-semibold
              text-blue-600
              hover:underline
              truncate
            "
          >
            {url.shortUrl}
          </a>
          <FaExternalLinkAlt className="text-xs text-blue-600 shrink-0" />
        </div>
        <p
          className="
            text-sm
            text-gray-500
            truncate
            mt-1
          "
          title={url.originalUrl}
        >
          {url.originalUrl}
        </p>
      </div>

      {/* Clicks */}
      <div className="flex items-center gap-3">
        <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center">
          <FaMousePointer className="text-sm text-green-600" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{url.clickCount ?? 0}</p>
          <p className="text-sm text-gray-500">Clicks</p>
        </div>
      </div>

      {/* Created Date */}
      <div>
        <p className="font-medium text-gray-700">{new Date(url.createdAt).toLocaleString()}</p>
        <p className="text-sm text-gray-500">Created</p>
      </div>

      {/* Copy */}
      <button
        onClick={handleCopy}
        className="
          text-sm
          bg-blue-600
          text-white
          font-medium
          px-4
          py-2
          rounded-lg
          flex
          items-center
          justify-center
          gap-2
          transition
          hover:bg-blue-700
          cursor-pointer
        "
      >
        <FaCopy />
        {copied ? "Copied" : "Copy"}
      </button>

      {/* Analytics */}
      <button
        onClick={handleAnalytics}
        className="
          bg-purple-600
          rounded-lg
          px-4
          py-2
          text-sm
          font-medium
          text-white
          flex
          items-center
          justify-center
          gap-2
          transition
          hover:bg-purple-700
          cursor-pointer
        "
      >
        Analytics
        <FaChartBar />
      </button>
    </div>
  );
};

export default ShortUrlCard;
