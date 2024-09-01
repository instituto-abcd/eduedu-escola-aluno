import { Embla } from "@mantine/carousel";
import { useEffect, useState } from "react";

type Props = Embla | undefined;

export function useCarouselState(c: Props) {
  const [controlState, setControlState] = useState({
    canScrollPrev: true,
    canScrollNext: true,
  });

  useEffect(() => {
    if (c) {
      c.on("scroll", (_c) => {
        setControlState({
          canScrollPrev: _c.canScrollPrev(),
          canScrollNext: _c.canScrollNext(),
        });
      });

      c.on("init", (_c) => {
        setControlState({
          canScrollPrev: _c.canScrollPrev(),
          canScrollNext: _c.canScrollNext(),
        });
      });
    }
  }, [c]);

  return controlState;
}
