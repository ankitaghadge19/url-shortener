import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CreateShortUrlModal = ({ onClose }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [createdUrl, setCreatedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      return;
    }

    // Dummy shortened URL for now.
    // Replace this with your backend API later.
    const alias = "ab8y9PG";

    setCreatedUrl(`lynklytics.com/s/${alias}`);
    setIsCreated(true);
  };

  const handleClose = () => {
    setOriginalUrl("");
    setIsCreated(false);
    setCreatedUrl("");
    setCopied(false);

    onClose();
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
          /* Create Form */
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
                Destination URL
              </label>

              <input
                id="originalUrl"
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/your-long-url"
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
                onClick={handleClose}
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
                Create Short URL
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
