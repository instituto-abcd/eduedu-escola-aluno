import { BackgroundImage, Stack, createStyles } from "@mantine/core";
import bg from "~/assets/bg-planet-track.png";
import { PlanetCompletedFeedback } from "~/components/PlanetCompletedFeedback";
import { PlanetTrack, PlanetTrackRef } from "~/components/PlanetTrack";
import { AwardsGrid } from "~/components/AwardsGrid";
import { useEffect, useRef, useState } from "react";
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
    bottom: "15%",
    cursor: "pointer",
    width: "100%",

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      display: "flex",
    },

    button: {
      background: "transparent",
      border: 0,
      cursor: "pointer",
      position: "absolute",
    },

    "button:nth-of-type(1)": {
      transform: "rotate(90deg)",
      left: "5%",
    },
    "button:nth-of-type(2)": {
      transform: "rotate(-90deg)",
      right: "5%",
    },
    "button:nth-of-type(2)[disabled]": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
});

export function DashboardPage() {
  const trackRef = useRef<PlanetTrackRef>(null);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [isBtnNextPlanetDisabled, setIsBtnNextPlanetDisabled] = useState(false);

  function onFeedbackEnd(lastPlanetId: string | null) {
    if (!lastPlanetId) return;

    const planets = trackRef.current?.track;
    const currentIndex =
      planets?.findIndex((planet) => planet.planetId === lastPlanetId) ?? -1;

    trackRef.current?.embla?.scrollTo(currentIndex + 1);
  }

  const { classes } = useStyles();
  const [viewMode, setViewMode] = useState<ViewMode>("planets");

  const nextPlanet = () => {
    trackRef.current?.embla?.scrollNext();

    setCurrentPlanetIndex(
      trackRef.current?.embla?.selectedScrollSnap() as number
    );
  };

  const prevPlanet = () => {
    trackRef.current?.embla?.scrollPrev();

    setCurrentPlanetIndex(
      trackRef.current?.embla?.selectedScrollSnap() as number
    );
  };

  useEffect(() => {
    if (trackRef.current && trackRef.current.track) {
      const track = trackRef.current.track;

      const nextIndex =
        currentPlanetIndex === track.length - 1
          ? currentPlanetIndex
          : currentPlanetIndex + 1;

      const IsnextPlanetDisabled =
        track[currentPlanetIndex].canExecutePlanet &&
        track[nextIndex].canExecutePlanet === false;

      setIsBtnNextPlanetDisabled(!IsnextPlanetDisabled);
    }
  }, [currentPlanetIndex]);

  return (
    <BackgroundImage
      src={bg}
      className={classes.bg}
    >
      <Stack
        className={classes.container}
        py="md"
      >
        <ViewModeToggle
          onModeChanged={setViewMode}
          mode={viewMode}
        />
        <Stack
          style={{ height: "100%", maxHeight: "calc(100vh - 200px)" }}
          justify="center"
        >
          <PlanetTrack
            visible={viewMode === "planets"}
            ref={trackRef}
          />
          <AwardsGrid visible={viewMode === "awards"} />
          <PlanetsGrid
            visible={viewMode === "list"}
            setViewMode={setViewMode}
          />
        </Stack>
      </Stack>
      {viewMode === "planets" && (
        <div className={classes.controls}>
          <button onClick={prevPlanet}>
            <ArrowDownBtn
              width={80}
              height={80}
            />
          </button>
          <button
            onClick={nextPlanet}
            disabled={isBtnNextPlanetDisabled}
          >
            <ArrowDownBtn
              width={80}
              height={80}
            />
          </button>
        </div>
      )}
      <PlanetCompletedFeedback onClose={onFeedbackEnd} />
    </BackgroundImage>
  );
}
