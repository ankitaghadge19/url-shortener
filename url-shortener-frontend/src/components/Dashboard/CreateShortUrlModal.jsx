import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createShortUrl } from "../../service/urlService";

const CreateShortUrlModal = ({ onClose, onCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [createdUrl, setCreatedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      const data = await createShortUrl(originalUrl.trim());

      setCreatedUrl(data.shortUrl);
      setIsCreated(true);
    } catch (error) {
      console.error("Failed to create short URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    if (isCreated) {
      await onCreated();
    } else {
      onClose();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(createdUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        px-4
      "
    >
      <div
        className="
          bg-white
          w-full
          max-w-lg
          rounded-xl
          shadow-xl
          p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isCreated ? "Short URL Created" : "Create Short URL"}
          </h2>

          <button
            onClick={handleClose}
            className="
              text-gray-400
              hover:text-gray-600
              transition
              cursor-pointer
            "
          >
            <FaTimes />
          </button>
        </div>

        {!isCreated ? (
          /* Create Short URL Form */
          <form onSubmit={handleCreate}>
            <div className="mb-6">
              <label
                htmlFor="originalUrl"
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Original URL
              </label>

              <input
                id="originalUrl"
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-2.5
                  outline-none
                  text-sm
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-gray-200
                  text-gray-700
                  text-sm
                  font-medium
                  hover:bg-gray-50
                  transition
                  cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="
                  px-4
                  py-2.5
                  rounded-lg
                  bg-custom-gradient
                  text-white
                  text-sm
                  font-medium
                  hover:opacity-90
                  transition
                  cursor-pointer
                "
              >
                {isLoading ? "Creating..." : "Create Short URL"}
              </button>
            </div>
          </form>
        ) : (
          /* Success State */
          <div>
            <div className="flex items-center gap-2">
              <div
                className="
                  flex-1
                  border
                  border-gray-200
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  text-blue-600
                  bg-gray-50
                  truncate
                "
              >
                {createdUrl}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="
                  px-4
                  py-2.5
                  rounded-lg
                  bg-blue-600
                  text-white
                  text-sm
                  font-medium
                  hover:bg-blue-700
                  transition
                  cursor-pointer
                  whitespace-nowrap
                "
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateShortUrlModal;
