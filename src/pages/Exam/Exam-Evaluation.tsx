import {
  BackgroundImage,
  Box,
  Center,
  Container,
  Flex,
  Loader,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSubmitExamEvaluation } from "~/api/student";
import bg from "~/assets/bgs/bg-exam-evaluation.jpg";
import { PATH } from "~/constants/path";
import Lottie from "react-lottie";
import loadingLottie from "~/assets/lotties/lottie_loading_anim.json";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { useEffect } from "react";

export function ExamEvaluationPage() {
  const navigate = useNavigate();

  useSubmitExamEvaluation({
    onSuccess: () => navigate(PATH.DASH_ALT),
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const mediaTrack = useMediaTrackStore();
  useEffect(() => {
    mediaTrack.clearQueue();
  }, []);

  return (
    <BackgroundImage src={bg} h="100vh">
      <Center>
        <Box style={{ color: "#fff", padding: "0px 0", fontSize: 20 }}>
          <Container>
            <Lottie options={defaultOptions} height={400} width={400} />
            <Flex direction="column" align="center" justify="center">
              <span>Você acabou de concluir a prova.</span>
              <span style={{ paddingBottom: 15 }}>
                Aguarde enquanto o sistema calcula as suas tarefas.
              </span>
              {true && <Loader />}
            </Flex>
          </Container>
        </Box>
      </Center>
    </BackgroundImage>
  );
}
