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
import { getShortUrl } from "../../utils/urlUtils";

const ShortUrlCard = ({ url }) => {
  // Track whether the short URL has been copied to provide button feedback.
  const [copied, setCopied] = useState(false);

  // Navigate to the analytics page for the selected URL.
  const navigate = useNavigate();

  // Convert the stored short URL into its complete, usable URL.
  const shortUrl = getShortUrl(url.shortUrl);

  // Copy the short URL to the clipboard and notify the user of the result.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopied(true);
      toast.success("Short URL copied!");

      // Reset the button label after briefly showing the copied state.
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Notify the user if clipboard access or copying fails.
      toast.error("Unable to copy URL");
    }
  };

  // Open the analytics page associated with this short URL's ID.
  const handleAnalytics = () => {
    void navigate(`/analytics/${url.id}`);
  };

  return (
    <div
      className="
        grid grid-cols-1
        lg:grid-cols-[auto_1.8fr_0.7fr_0.9fr_auto_auto]
        items-center gap-4 lg:gap-5
        rounded-xl border border-gray-200
        bg-white px-4 py-3 shadow-sm
      "
    >
      {/* Display the link icon on large screens. */}
      <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-blue-100 lg:flex">
        <FaLink className="text-blue-600" />
      </div>

      {/* Display the short URL and its original destination. */}
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={shortUrl}
            className="truncate font-semibold text-blue-600 hover:underline"
          >
            {shortUrl}
          </a>

          <FaExternalLinkAlt className="shrink-0 text-xs text-blue-600" />
        </div>

        <p
          className="mt-1 truncate text-sm text-gray-500"
          title={url.originalUrl}
        >
          {url.originalUrl}
        </p>

        {/* Show click count and creation date on small screens. */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 text-sm text-gray-500 lg:hidden">
          <span>{url.clickCount ?? 0} clicks</span>
          <span>•</span>
          <span>
            {url.createdAt
              ? new Date(url.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Display the click count on large screens. */}
      <div className="hidden items-center gap-3 lg:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <FaMousePointer className="text-sm text-green-600" />
        </div>

        <div>
          <p className="font-medium text-gray-800">{url.clickCount ?? 0}</p>
          <p className="text-sm text-gray-500">Clicks</p>
        </div>
      </div>

      {/* Display the creation date on large screens. */}
      <div className="hidden lg:block">
        <p className="font-medium text-gray-700">
          {url.createdAt ? new Date(url.createdAt).toLocaleString() : "N/A"}
        </p>
        <p className="text-sm text-gray-500">Created</p>
      </div>

      {/* Provide actions to copy the short URL or view its analytics. */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="
            flex items-center justify-center gap-2
            rounded-lg bg-blue-600 px-4 py-2
            text-sm font-medium text-white
            transition hover:bg-blue-700
          "
        >
          <FaCopy />
          {copied ? "Copied" : "Copy"}
        </button>

        <button
          type="button"
          onClick={handleAnalytics}
          className="
            flex items-center justify-center gap-2
            rounded-lg bg-purple-600 px-4 py-2
            text-sm font-medium text-white
            transition hover:bg-purple-700
          "
        >
          Analytics
          <FaChartBar />
        </button>
      </div>
    </div>
  );
};

export default ShortUrlCard;