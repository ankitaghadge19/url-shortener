import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaCopy,
  FaExternalLinkAlt,
  FaLink,
  FaMousePointer,
} from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";

const ShortUrlCard = ({ url }) => {
  const [copied, setCopied] = useState(false);

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
  return (
      <div className="grid grid-cols-1 
      border border-gray-100 rounded-xl gap-5
      bg-white shadow-sm px-4 py-3
    lg:grid-cols-[auto_1.8fr_0.7fr_0.9fr_auto_auto_auto]">
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
            className="font-semibold text-blue-600 hover:underline"
          >
            {url.shortUrl}
          </a>
          <FaExternalLinkAlt className="text-xs text-blue-600" />
        </div>

        <p className="text-sm text-gray-500">{url.originalUrl}</p>
      </div>

      {/* Clicks */}
      <div className="flex items-center gap-3">
        <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center">
          <FaMousePointer className="text-sm text-green-600" />
        </div>

        <div>
          <p className="font-medium text-gray-800">{url.clicks}</p>
          <p className="text-sm text-gray-500">Clicks</p>
        </div>
      </div>

      {/* Created Date */}
      <div className="">
        <div>
          <p className="font-medium text-gray-700">{url.createdAt}</p>
          <p className="text-sm text-gray-500">Created</p>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="text-sm bg-blue-600 text-white 
              font-medium px-4 py-2 rounded-lg 
              flex items-center justify-center gap-2
              transition hover:bg-blue-700 cursor-pointer"
      >
        <FaCopy />
        {copied ? "Copied" : "Copy"}
      </button>

      {/* Analytics Button */}
      <button
        className="bg-purple-600 rounded-lg px-4 py-2
          text-sm font-medium text-white
          flex items-center justify-center gap-2
          transition hover:bg-purple-700 cursor-pointer"
      >
        Analytics
        <FaChartBar />
      </button>
    </div>
  );
};

export default ShortUrlCard;
