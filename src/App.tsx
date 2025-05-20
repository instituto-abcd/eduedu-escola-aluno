import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AppRoutes } from "./routes";
import { useDebugInfo } from "./stores/debug-info";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 2,
		},
	},
});

// TODO: use new env
useDebugInfo.setState({
	AudioButton: import.meta.env.DEV,
	VideoPlayer: import.meta.env.DEV,
	answer: import.meta.env.DEV,
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AppRoutes />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
