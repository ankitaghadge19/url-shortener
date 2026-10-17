
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "./api/queryClient.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";

// Render the application and provide shared query caching and authentication.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Makes the shared QueryClient available throughout the app. */}
    <QueryClientProvider client={queryClient}>
      {/* Makes authentication state available throughout the app. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
