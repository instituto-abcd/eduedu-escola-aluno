import { BackgroundImage, Button, Center, Stack } from "@mantine/core";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgIntro from "~/assets/bgs/bg-intro-video.png";
import { PATH } from "~/constants/path";

export function IntroPage() {
  const navigate = useNavigate();

  const ref = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <BackgroundImage src={bgIntro} h="100vh">
      <Center h="100vh">
        <Stack>
          <video
            autoPlay
            src="https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/student%2FABERTURA.mp4?alt=media&token=5776a00f-1b23-4953-beab-550d71f891e9"
            ref={ref}
            width={720}
            height={540}
            onPlay={() => {
              setIsPlaying(true);
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
          ></video>
          <Button disabled={isPlaying} onClick={() => navigate(PATH.EXAM)}>Iniciar prova</Button>
        </Stack>
      </Center>
    </BackgroundImage>
  );
}
