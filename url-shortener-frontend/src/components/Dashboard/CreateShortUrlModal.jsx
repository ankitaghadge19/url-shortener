import { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

import { createShortUrl } from "../../service/urlService";
import { getShortUrl } from "../../utils/urlUtils";

const CreateShortUrlModal = ({ onClose, onCreated }) => {
  // Store the original URL entered by the user.
  const [originalUrl, setOriginalUrl] = useState("");

  // Track whether the short URL has been created successfully.
  // This determines whether the modal displays the input form or the result.
  const [isCreated, setIsCreated] = useState(false);

  // Store the complete short URL to display and copy after creation.
  const [createdUrl, setCreatedUrl] = useState("");

  // Track whether the short URL has been copied to the clipboard.
  const [copied, setCopied] = useState(false);

  // Prevent duplicate submissions and show the loading state during creation.
  const [isLoading, setIsLoading] = useState(false);

  // Validate the entered URL and submit the request to create a short URL.
  const handleCreate = async (e) => {
    // Prevent the browser from submitting the form and reloading the page.
    e.preventDefault();

    // Ignore repeated submissions while a request is already in progress.
    if (isLoading) return;

    // Reject empty input or input containing only whitespace.
    if (!originalUrl.trim()) {
      toast.error("Please enter a URL.");
      return;
    }

    let parsedUrl;

    try {
      // Parse the input to verify that it is a valid URL.
      // Trim whitespace before parsing so accidental spaces do not cause errors.
      parsedUrl = new URL(originalUrl.trim());
    } catch {
      // Show a validation message if the input cannot be parsed as a URL.
      toast.error("Enter a valid URL, including https://.");
      return;
    }

    // Only allow HTTP and HTTPS URLs.
    // This prevents unsupported protocols such as javascript: from being submitted.
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      toast.error("Only HTTP and HTTPS URLs are supported.");
      return;
    }

    try {
      // Show the loading state while the backend creates the short URL.
      setIsLoading(true);

      // Send the normalized URL to the backend service.
      const data = await createShortUrl(parsedUrl.href);

      // Convert the returned short code or URL into the complete short URL.
      setCreatedUrl(getShortUrl(data.shortUrl));

      // Switch the modal from the input form to the creation result.
      setIsCreated(true);
    } catch {
      // Inform the user if the request fails.
      toast.error("Unable to create the short link. Please try again.");
    } finally {
      // Always clear the loading state after the request finishes.
      setIsLoading(false);
    }
  };

  // Handle closing the modal after creation or cancelling before creation.
  const handleClose = async () => {
    if (isCreated && onCreated) {
      // Refresh the parent component's data after successful creation.
      await onCreated();
    } else {
      // Close the modal without triggering the post-creation callback.
      onClose();
    }
  };

  // Copy the generated short URL to the user's clipboard.
  const handleCopy = async () => {
    try {
      // Use the browser Clipboard API to copy the short URL.
      await navigator.clipboard.writeText(createdUrl);

      // Temporarily update the button label to confirm the copy action.
      setCopied(true);

      // Restore the original button label after two seconds.
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard access can fail if browser permissions or security requirements are not satisfied, so provide a manual-copy fallback message.
      toast.error("Unable to copy the URL. Please copy it manually.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Display a heading based on whether URL creation has completed. */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {isCreated ? "Short URL Created" : "Create Short URL"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="cursor-pointer text-gray-400 transition hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {!isCreated ? (
          // Show the URL input form until the short URL is created.
          <form onSubmit={handleCreate}>
            <div className="mb-6">
              <label
                htmlFor="originalUrl"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Original URL
              </label>

              <input
                id="originalUrl"
                type="url"
                value={originalUrl}
                // Keep the input value synchronized with React state.
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Provide cancellation and form-submission actions. */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                // Prevent another submission while the request is running.
                disabled={isLoading}
                className="cursor-pointer rounded-lg bg-custom-gradient px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating..." : "Create Short URL"}
              </button>
            </div>
          </form>
        ) : (
          // Show the generated short URL and copy action after creation.
          <div>
            <div className="flex items-center gap-2">
              <div className="flex-1 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-blue-600">
                {createdUrl}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="cursor-pointer whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
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
