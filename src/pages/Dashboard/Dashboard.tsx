import { BackgroundImage, Container } from "@mantine/core";
import bg from "~/assets/bgs/bg-dashboard.jpg";
import { PlanetCompletedFeedback } from "~/components/PlanetCompletedFeedback";
import { Awards } from "./Awards";
import { PlanetTrack } from "./PlanetTrack";

export function DashboardPage() {
  return (
    <BackgroundImage src={bg} h="100vh">
      <Container size="xl" mt={50}>
        <PlanetTrack />
        <Awards />
      </Container>
      <PlanetCompletedFeedback />
    </BackgroundImage>
  );
}
