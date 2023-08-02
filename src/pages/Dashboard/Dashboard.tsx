import { BackgroundImage, Container } from "@mantine/core";
import bg from "~/assets/bgs/bg-dashboard.jpg";
import { Planets } from "./Planets";
import { Awards } from "./Awards";
import { errorNotification } from "~/utils/errorNotification";
import { useState } from "react";
import { useGetStudentAwardsQuery, useGetStudentPlanetTrackQuery } from "~/api/student";

export function DashboardPage() {

    const [planetTrack, setPlanetTrack] = useState([])
    const [awards, setAwards] = useState([])

    const { data: getPlanetTrack } = useGetStudentPlanetTrackQuery({
        onError: (error) => {
            errorNotification(
                "Erro durante a operação",
                `${error.message} (cod: ${error.code})`
            );
        },
        onSuccess: (data) => {
            setPlanetTrack(data.planetTrack)
        },
    })

    const { data: getAwards } = useGetStudentAwardsQuery({
        onError: (error) => {
            errorNotification(
                "Erro durante a operação",
                `${error.message} (cod: ${error.code})`
            );
        },
        onSuccess: (data) => {
            setAwards(data.awards)
        },
    })
    return (
        <BackgroundImage src={bg} h="100vh">
            <Container size="xl" mt={50}>
                <Planets planets={planetTrack} />
                <Awards awards={awards} />
            </Container>
        </BackgroundImage >
    )
}