import { BackgroundImage, Button, Center, Stack } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgIntro from "~/assets/bgs/bg-intro-video.png";
import { PATH } from "~/constants/path";

export function IntroPage() {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_ASSETS === "LOCAL" ?
    import.meta.env.VITE_API_URL + "assets-data/ABERTURA.mp4" :
    "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/student%2FABERTURA.mp4?alt=media&token=5776a00f-1b23-4953-beab-550d71f891e9";

  const [canGoToExam, setCanGoToExam] = useState(false);

  return (
    <BackgroundImage src={bgIntro} h="100vh">
      <Center h="100vh">
        <Stack>
          <video
            autoPlay
            src={url}
            width={720}
            height={540}
            onLoad={() => {
              setCanGoToExam(false);
            }}
            onPlay={() => {
              setCanGoToExam(false);
            }}
            onPause={() => {
              setCanGoToExam(true);
            }}
          ></video>
          {/* TODO: Retornar disable do botão abaixo */}
          {/* <Button disabled={!canGoToExam} onClick={() => navigate(PATH.EXAM)}>Iniciar prova</Button> */}
          <Button onClick={() => navigate(PATH.EXAM)}>Iniciar prova</Button>
        </Stack>
      </Center>
    </BackgroundImage>
  );
}
