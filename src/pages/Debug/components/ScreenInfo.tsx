import { useViewportSize } from "@mantine/hooks";
import { useDebugInfo } from "~/stores/debug-info";

export function ScreenInfo() {
	const { width, height } = useViewportSize();
	const debug = useDebugInfo();

	if (!debug.dimensions) return;

	return (
		<p className="text-red-500 font-bold text-sm">
			{width}x{height}
		</p>
	);
}
