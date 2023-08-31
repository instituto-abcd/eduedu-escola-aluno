import { BackgroundImage, Container } from "@mantine/core";
import bg from "~/assets/bgs/bg-dashboard.jpg";
import { Awards } from "./Awards";
import { errorNotification } from "~/utils/errorNotification";
import { useState } from "react";
import { useGetStudentAwardsQuery } from "~/api/student";
import { PlanetTrack } from "./PlanetTrack";

export function DashboardPage() {
  const [awards, setAwards] = useState([]);

  const { data: getAwards } = useGetStudentAwardsQuery({
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      );
    },
    onSuccess: (data) => {
      setAwards(data.awards);
    },
  });
  return (
    <BackgroundImage src={bg} h="100vh">
      <Container size="xl" mt={50}>
        <PlanetTrack />
        <Awards awards={awards} />
      </Container>
    </BackgroundImage>
  );
}
