import { Carousel } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { type MediaQueryKey } from "~/constants/dimensions";
import atividades from "~/assets/atividades.png";
import conquistas from "~/assets/conquistas.png";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";
import classes from "./ViewModeToggle.module.css";

const modeIndex: Record<ViewMode, number> = {
  planets: 0,
  awards: 1,
  list: 2,
};

export type ViewMode = "planets" | "awards" | "list";

type Props = {
  forceBehavior?: MediaQueryKey;
  onModeChanged: (mode: ViewMode) => void;
  mode?: ViewMode;
};

export function ViewModeToggle({ mode = "planets", onModeChanged }: Props) {
  const [carousel, setCarousel] = useState<EmblaCarouselType | null>(null);
  const breakpoint = useCurrentBreakpoint();

  useEffect(() => {
    if (!carousel) return;

    // Força o carrossel a respeitar `mode`
    carousel.on("init", (c) => {
      c.scrollTo(modeIndex[mode]);
    });
  }, [carousel]);

  if (breakpoint === "MOBILE")
    return (
      <Carousel
        getEmblaApi={setCarousel}
        withControls={false}
        slideSize={241}
        slideGap={20}
        onSlideChange={(inx) =>
          onModeChanged((["planets", "awards"] as ViewMode[])[inx])
        }
      >
        <Carousel.Slide>
          <Image
            w={241}
            h={180}
            src={atividades}
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <Image
            w={207}
            h={180}
            src={conquistas}
          />
        </Carousel.Slide>
      </Carousel>
    );

  return (
    <div className="flex justify-between px-5 py-2.5">
      <Image
        w={241}
        h={180}
        src={atividades}
        onClick={() => onModeChanged(mode === "planets" ? "list" : "planets")}
        className={classes.img}
      />
      <Image
        w={207}
        h={180}
        src={conquistas}
        onClick={() => onModeChanged("awards")}
        className={classes.img}
      />
    </div>
  );
}
