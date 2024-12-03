import { useViewportSize } from "@mantine/hooks";

export function ScreenInfo() {
  const { width, height } = useViewportSize();

  return (
    <p className="text-red-500 font-bold text-sm">
      {width}x{height}
    </p>
  );
}
