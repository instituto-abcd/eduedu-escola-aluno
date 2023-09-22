import { BackgroundImage, Stack } from "@mantine/core";
import bg from "~/assets/bgs/bg-dashboard.jpg";
import fimProvaAudio from "~/assets/audio/FIM_PROVA.mp3";
import fimProvaLottie from "~/assets/lotties/FIM_PROVA.json";
import Lottie from "react-lottie";

export function DashboardAlt() {
  return (
    <BackgroundImage src={bg} h="100vh">
      <Stack h="100%" w="100%" align="center" justify="center">
        <audio style={{ display: "none" }} src={fimProvaAudio} autoPlay />
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: fimProvaLottie,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={400}
          width={400}
        />
      </Stack>
    </BackgroundImage>
  );
}
