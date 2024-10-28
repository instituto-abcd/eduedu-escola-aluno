import { BackgroundImage, Group, Stack, createStyles } from "@mantine/core";
import bg from "~/assets/bg-planet-track.png";
import { PlanetCompletedFeedback } from "~/components/PlanetCompletedFeedback";
import { PlanetTrack, PlanetTrackRef } from "~/components/PlanetTrack";
import { AwardsGrid } from "~/components/AwardsGrid";
import { useRef, useState } from "react";
import { ViewModeToggle, type ViewMode } from "~/components/ViewModeToggle";
import { ArrowDownBtn } from "~/components/icons/ArrowDownBtn";
import { MEDIA_QUERY } from "~/constants/dimensions";
import { PlanetsGrid } from "~/components/PlanetsGrid";

const useStyles = createStyles({
  bg: {
    height: "100vh",
    maxHeight: "100vh",
    width: "100vw",
    objectPosition: "center",
    objectFit: "cover",
    overflow: "hidden",
    position: "relative",
  },

  container: {
    maxWidth: 900,
    marginInline: "auto",
    height: "100%",
  },

  controls: {
    display: "none",
    position: "absolute",
    inset: 0,
    top: "auto",
    width: "100%",
    padding: 20,
    maxWidth: 1000,
    marginInline: "auto",

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      display: "flex",
    },

    "svg:nth-of-type(1)": {
      transform: "rotate(90deg)",
    },
    "svg:nth-of-type(2)": {
      transform: "rotate(-90deg)",
    },
  },
});

export function DashboardPage() {
  const trackRef = useRef<PlanetTrackRef>(null);
  function onFeedbackEnd(lastPlanetId: string | null) {
    if (!lastPlanetId) return;

    const planets = trackRef.current?.track;
    const currentIndex =
      planets?.findIndex((planet) => planet.planetId === lastPlanetId) ?? -1;

    trackRef.current?.embla?.scrollTo(currentIndex + 1);
  }

  const { classes } = useStyles();
  const [viewMode, setViewMode] = useState<ViewMode>("planets");

  return (
    <BackgroundImage src={bg} className={classes.bg}>
      <Stack className={classes.container} py="md">
        <ViewModeToggle onModeChanged={setViewMode} mode={viewMode} />
        <Stack
          style={{ height: "100%", maxHeight: "calc(100vh - 200px)" }}
          justify="center"
        >
          <PlanetTrack visible={viewMode === "planets"} ref={trackRef} />
          <AwardsGrid visible={viewMode === "awards"} />
          <PlanetsGrid
            visible={viewMode === "list"}
            setViewMode={setViewMode}
          />
        </Stack>
      </Stack>
      {viewMode === "planets" && (
        <Group className={classes.controls} noWrap position="apart">
          <ArrowDownBtn
            width={80}
            height={80}
            onClick={() => trackRef.current?.embla?.scrollPrev()}
          />
          <ArrowDownBtn
            width={80}
            height={80}
            onClick={() => trackRef.current?.embla?.scrollNext()}
          />
        </Group>
      )}
      <PlanetCompletedFeedback onClose={onFeedbackEnd} />
    </BackgroundImage>
  );
}
