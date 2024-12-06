import { Carousel, Embla } from "@mantine/carousel";
import { createStyles, Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetPlanetTrack } from "~/api/student";
import { useGridSlide } from "~/hooks/useGridSlide";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";
import { MediaQueryKey } from "~/constants/dimensions";
import { PlanetCard } from "../PlanetCard/PlanetCard";
import { Header } from "~/pages/Login/components/Header";
import { ViewMode } from "../ViewModeToggle";
import { useUnlockPlanets } from "~/stores/unlock-planets";

type Props = {
  visible: boolean;
  setViewMode: (mode: ViewMode) => void;
};

export function PlanetsGrid({ visible, setViewMode }: Props) {
  const { unlockAll, unlockLimit } = useUnlockPlanets();

  const { data } = useGetPlanetTrack(undefined, {
    usePlanetAvailability: !unlockLimit,
    hideLastPlanets: !unlockAll,
    canExecuteAnyPlanet: unlockAll,
  });

  const breakpoint = useCurrentBreakpoint();
  const gridLayoutMap: Record<MediaQueryKey, [number, number]> = {
    MOBILE: [1, 2],
    TABLET_HORZ: [4, 4],
    TABLET_VERT: [4, 4],
    DESKTOP: [4, 4],
  };

  const gridSlides = useGridSlide({
    items: data?.planetTrack ?? [],
    layout: gridLayoutMap[breakpoint],
  });

  const [carousel, setEmbla] = useState<Embla>();
  useEffect(() => {
    carousel?.reInit();
  }, [breakpoint]);

  const { classes } = useStyles(visible);

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
            <Group
              position="center"
              noWrap={breakpoint === "MOBILE"}
            >
              {sl.map((planet, i) => (
                <PlanetCard
                  planet={planet}
                  key={i}
                  size="small"
                />
              ))}
            </Group>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Stack>
  );
}

const useStyles = createStyles((_, visible: boolean) => ({
  carousel: {
    maxHeight: "80vh",
    display: visible ? "block" : "none",
    marginBlock: "auto",
    overflowY: "auto",
    top: 60,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
    display: visible ? "block" : "none",
  },
}));
