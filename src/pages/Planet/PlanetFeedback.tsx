import {
  BackgroundImage,
  Box,
  Center,
  Container,
  Flex,
  Loader,
} from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "~/assets/bgs/bg-exam-evaluation.jpg";
import { PATH } from "~/constants/path";
import { useMediaTrackStore } from "~/stores/media-track.store";

export function PlanetFeedbackPage() {
  const navigate = useNavigate();

  const { start } = useTimeout(() => navigate(PATH.DASHBOARD), 3000);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    start();
    mediaTrack.clearQueue();
  }, []);

  return (
    <BackgroundImage src={bg} h="100vh">
      <Center h="100vh">
        <Box style={{ color: "#fff", padding: "0px 0", fontSize: 20 }}>
          <Container>
            <Flex direction="column" align="center" justify="center">
              <span>Você acabou de concluir a prova.</span>
              <span style={{ paddingBottom: 15 }}>
                Aguarde enquanto o sistema calcula as suas tarefas.
              </span>
              <Loader />
            </Flex>
          </Container>
        </Box>
      </Center>
    </BackgroundImage>
  );
}
