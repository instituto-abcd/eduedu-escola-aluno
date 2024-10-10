import { useEffect, useState } from "react";
import type { MediaQueryKey } from "~/constants/dimensions";

export function useCurrentBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<MediaQueryKey>("MOBILE");

  useEffect(() => {
    const update = () => {
      setBreakpoint(
        window.innerWidth < 768
          ? "MOBILE"
          : window.innerWidth < 1024
            ? "TABLET_VERT"
            : "DESKTOP",
      );
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return breakpoint;
}
