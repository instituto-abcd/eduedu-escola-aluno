import { Carousel } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetPlanetTrack } from "~/api/student";
import { useGridSlide } from "~/hooks/useGridSlide";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";
import { MediaQueryKey } from "~/constants/dimensions";
import { PlanetCard } from "../PlanetCard/PlanetCard";
import { Header } from "~/pages/Login/components/Header";
import { ViewMode } from "../ViewModeToggle";
import type { PlanetTrackRef } from "../PlanetTrack";
import styles from "./PlanetsGridStyle.module.css";

type Props = {
  setViewMode: (mode: ViewMode) => void;
};

export const PlanetsGrid = forwardRef<PlanetTrackRef, Props>(
  ({ setViewMode }, ref) => {
    const { data } = useGetPlanetTrack();

    const breakpoint = useCurrentBreakpoint();
    const gridLayoutMap: Record<MediaQueryKey, [number, number]> = {
      MOBILE: [1, 2],
      TABLET_HORZ: [5, 3],
      TABLET_VERT: [5, 3],
      DESKTOP: [5, 3],
    };

    const gridSlides = useGridSlide({
      items: data?.planetTrack ?? [],
      layout: gridLayoutMap[breakpoint],
    });

    const [carousel, setEmbla] = useState<EmblaCarouselType | null>(null);
    useEffect(() => {
      carousel?.reInit();
    }, [breakpoint]);


    useImperativeHandle(ref, () => ({
      embla: carousel,
      track: data?.planetTrack,
    }));

    return (
      <div className="flex flex-col gap-0">
        <div className={styles.header}>
          <Header
            title=""
            onClose={() => setViewMode("planets")}
            transparent
          />
        </div>
        <Carousel
          getEmblaApi={setEmbla}
          withControls={false}
          className={styles.carousel}
          orientation={breakpoint === "MOBILE" ? "vertical" : "horizontal"}
          emblaOptions={{ align: "start" }}
          pb={150}
        >
          {gridSlides.map((sl, inx) => (
            <Carousel.Slide key={inx}>
              <div className="flex flex-row flex-wrap gap-x-4 justify-center">
                {sl.map((planet, i) => (
                  <PlanetCard
                    planet={planet}
                    key={i}
                    size="small"
                  />
                ))}
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    );
  }
);
