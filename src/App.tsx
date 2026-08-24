import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AppRoutes } from "./routes";
import { useDebugInfo } from "./stores/debug-info";
import { env } from "./env";
import { useLockZoom } from "./hooks/useLockZoom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

useDebugInfo.setState({
  AudioButton: env.isDev,
  VideoPlayer: env.isDev,
  answer: env.isDev,
  dimensions: env.isDev || env.isQA,
  planetTrack: env.isDev || env.isQA,
});

function App() {
  useLockZoom();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
