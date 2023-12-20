import { BackgroundImage, Container } from "@mantine/core";
import bg from "~/assets/bgs/bg-dashboard.jpg";
import { PlanetCompletedFeedback } from "~/components/PlanetCompletedFeedback";
import { Awards } from "./Awards";
import { PlanetTrack, PlanetTrackRef } from "./PlanetTrack";
import { useRef } from "react";

export function DashboardPage() {
  const trackRef = useRef<PlanetTrackRef>(null);
  function onFeedbackEnd(lastPlanetId: string | null) {
    if (!lastPlanetId) return;

    const planets = trackRef.current?.track;
    const currentIndex =
      planets?.findIndex((planet) => planet.planetId === lastPlanetId) ?? -1;

    trackRef.current?.embla?.scrollTo(currentIndex + 1);
  }

  return (
    <BackgroundImage src={bg} h="100vh">
      <Container size="xl" mt={50}>
        <PlanetTrack ref={trackRef} />
        <Awards />
      </Container>
      <PlanetCompletedFeedback onClose={onFeedbackEnd} />
    </BackgroundImage>
  );
}
