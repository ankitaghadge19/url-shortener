
import { QueryClient } from "@tanstack/react-query";

// Centralized configuration for caching and fetching server data.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Treat cached data as stale immediately.
      refetchOnWindowFocus: true, // Refetch stale data when the user returns to the tab.
      refetchOnReconnect: true, // Refetch stale data when the network reconnects.
      retry: 1, // Retry a failed query once.
    },
  },
});

export default queryClient;