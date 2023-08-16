import { BackgroundImage, Button, Center, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import bgIntro from "~/assets/bgs/bg-intro-video.png";
import { PATH } from "~/constants/path";

export function IntroPage() {
  const navigate = useNavigate();

  return (
    <BackgroundImage
      src={bgIntro}
      maw={1440}
      mih="100vh"
      mx="auto"
      p={0}
      styles={{ main: { padding: 0, position: "relative" } }}
    >
      <Center h="100vh">
        <Stack>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/TA-NanjtvGI"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <Button onClick={() => navigate(PATH.EXAM)}>Iniciar prova</Button>
        </Stack>
      </Center>
    </BackgroundImage>
  );
}
