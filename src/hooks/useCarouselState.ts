import type { EmblaCarouselType } from "embla-carousel";
import { useEffect, useState } from "react";

export function useCarouselState(embla: EmblaCarouselType | null) {
  const [controlState, setControlState] = useState({
    canScrollPrev: true,
    canScrollNext: true,
  });

  useEffect(() => {
    if (!embla) return;

    const updateState = () => {
      setControlState({
        canScrollPrev: embla.canScrollPrev(),
        canScrollNext: embla.canScrollNext(),
      });
    };

    updateState();
    embla.on("scroll", updateState);
    embla.on("reInit", updateState);

    return () => {
      embla.off("scroll", updateState);
      embla.off("reInit", updateState);
    };
  }, [embla]);

  return controlState;
}
