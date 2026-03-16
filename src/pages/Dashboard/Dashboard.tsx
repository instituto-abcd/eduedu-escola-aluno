import { BackgroundImage } from "@mantine/core";
import bg from "~/assets/bg-planet-track.png";
import { PlanetCompletedFeedback } from "~/components/PlanetCompletedFeedback";
import { PlanetTrack, PlanetTrackRef } from "~/components/PlanetTrack";
import { AwardsGrid } from "~/components/AwardsGrid";
import { useRef, useState } from "react";
import { ViewModeToggle, type ViewMode } from "~/components/ViewModeToggle";
import { ArrowDownBtn } from "~/components/icons/ArrowDownBtn";
import { PlanetsGrid } from "~/components/PlanetsGrid";
import { PlanetTrackDebug } from "~/components/debug-components";
import classes from "./Dashboard.module.css";

export function DashboardPage() {
  const trackRef = useRef<PlanetTrackRef>(null);

  function onFeedbackEnd(lastPlanetId: string | null) {
    if (!lastPlanetId) return;

    const planets = trackRef.current?.track;
    const currentIndex =
      planets?.findIndex((planet) => planet.planetId === lastPlanetId) ?? -1;

    trackRef.current?.embla?.scrollTo(currentIndex + 1);
  }

  const [viewMode, setViewMode] = useState<ViewMode>("planets");

  return (
    <BackgroundImage
      src={bg}
      className={classes.bg}
    >
      <div className="max-w-[900px] mx-auto h-full py-4 flex flex-col">
        <ViewModeToggle
          onModeChanged={setViewMode}
          mode={viewMode}
        />
        <div
          className="flex flex-col justify-center"
          style={{ height: "100%", maxHeight: "calc(100vh - 200px)" }}
        >
          {viewMode === "planets" && <PlanetTrack ref={trackRef} />}

          {viewMode === "awards" && <AwardsGrid />}

          {viewMode === "list" && (
            <PlanetsGrid
              ref={trackRef}
              setViewMode={setViewMode}
            />
          )}
        </div>
      </div>
      {["planets", "list"].includes(viewMode) && (
        <div className={classes.controls}>
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
        </div>
      )}
      <PlanetCompletedFeedback onClose={onFeedbackEnd} />

      <div className="absolute bottom-4 inset-x-0 mx-auto flex gap-4 w-fit">
        <PlanetTrackDebug />
      </div>
    </BackgroundImage>
  );
}
