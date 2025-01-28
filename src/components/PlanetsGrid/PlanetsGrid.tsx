import { Carousel, Embla } from "@mantine/carousel";
import { createStyles, Stack } from "@mantine/core";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetPlanetTrack } from "~/api/student";
import { useGridSlide } from "~/hooks/useGridSlide";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";
import { MediaQueryKey } from "~/constants/dimensions";
import { PlanetCard } from "../PlanetCard/PlanetCard";
import { Header } from "~/pages/Login/components/Header";
import { ViewMode } from "../ViewModeToggle";
import { useUnlockPlanets } from "~/stores/unlock-planets";
import type { PlanetTrackRef } from "../PlanetTrack";

type Props = {
  setViewMode: (mode: ViewMode) => void;
};

export const PlanetsGrid = forwardRef<PlanetTrackRef, Props>(
  ({ setViewMode }, ref) => {
    const { unlockAll, unlockLimit } = useUnlockPlanets();

    const { data } = useGetPlanetTrack(undefined, {
      usePlanetAvailability: !unlockLimit,
      hideLastPlanets: !unlockAll,
      canExecuteAnyPlanet: unlockAll,
    });

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

    const [carousel, setEmbla] = useState<Embla>();
    useEffect(() => {
      carousel?.reInit();
    }, [breakpoint]);

    const { classes } = useStyles();

    useImperativeHandle(ref, () => ({
      embla: carousel,
      track: data?.planetTrack,
    }));

    return (
      <Stack spacing={0}>
        <div className={classes.header}>
          <Header
            title=""
            onClose={() => setViewMode("planets")}
            transparent
          />
        </div>
        <Carousel
          getEmblaApi={setEmbla}
          withControls={false}
          className={classes.carousel}
          orientation={breakpoint === "MOBILE" ? "vertical" : "horizontal"}
          align="start"
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
      </Stack>
    );
  }
);

const useStyles = createStyles((_) => ({
  carousel: {
    maxHeight: "80vh",
    marginBlock: "auto",
    top: 60,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
  },
}));
