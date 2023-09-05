import {
  BackgroundImage,
  Image,
  Button,
  Center,
  Progress,
} from "@mantine/core";
import { Outlet } from "react-router-dom";
import lousa from "~/assets/bgs/lousa.svg";
import { useExamProgress } from "~/stores/exam-progress";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../Navbar/Navbar";

// Images:
import sala_1680 from "~/assets/bgs/sala_1680x1050.png";
import sala_1920 from "~/assets/bgs/sala_1920x1080.png";
import sala_1440 from "~/assets/bgs/sala_1440x1080.png";
import sala_3000 from "~/assets/bgs/sala_3000x900.png";

// Lotties:
import Lottie from "react-lottie";
import hologramaEduEdu from "~/assets/lotties/exam/holograma_eduedu.json";
import livroAberto from "~/assets/lotties/exam/livro_aberto.json";
import livros from "~/assets/lotties/exam/livros.json";
import luzRodape from "~/assets/lotties/exam/luz_rodape.json";
import luzMesa from "~/assets/lotties/exam/luz_mesa.json";
import vaso1 from "~/assets/lotties/exam/vaso_1.json";
import vaso2 from "~/assets/lotties/exam/vaso_2.json";

export function ExamLayout() {
  const examProgress = useExamProgress((state) => state.value);

  const mediaTrack = useMediaTrackStore();
  const currentAudio =
    mediaTrack.currentTrack?.mediaType === MediaType.AUDIO
      ? mediaTrack.currentTrack
      : null;

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentAudio) {
      void audioRef.current?.play();
    }
  }, [currentAudio]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [bgProva, setBgProva] = useState("");

  useEffect(() => {
    setBgProva(sala_3000);
    // if (screenWidth > 1920) { setBgProva(sala_1920); }
    // else if (screenWidth < 1920 && screenWidth >= 1680) { setBgProva(sala_1680); }
    // else { setBgProva(sala_1440) }

    audioRef.current && audioRef.current.setAttribute("src", "");
  }, []);

  return (
    <BackgroundImage
      src={bgProva}
      mih="100vh"
      mx="auto"
      p={0}
      styles={{ main: { padding: 0, position: "relative" } }}
    >
      <Navbar />
      <Center style={{ position: "relative" }}>
        <Progress
          value={examProgress}
          w={750}
          style={{ position: "absolute", top: 20 }}
          size="lg"
          striped
          animate
          radius="xl"
        />
        <BackgroundImage
          src={lousa}
          w={1140}
          h={846}
          mt={10}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          <Center h="80%" mt={55}>
            <Outlet />
          </Center>
        </BackgroundImage>
      </Center>

      {/* <>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: livros,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            zIndex: 555,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: livroAberto,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            zIndex: 555,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: hologramaEduEdu,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            zIndex: 555,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: vaso1,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            zIndex: 555,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: vaso2,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            zIndex: 555,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: luzRodape,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            zIndex: 500,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: luzMesa,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            zIndex: 500,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        />
      </> */}

      <audio
        style={{ display: "none" }}
        src={currentAudio?.trackUrl ?? ""}
        ref={audioRef}
        onPlay={() => mediaTrack.setPlayStatus(true)}
        onPause={() => mediaTrack.setPlayStatus(false)}
        onEnded={() => {
          if (mediaTrack.hasQueue()) {
            mediaTrack.playNext();
          }
          mediaTrack.setPlayStatus(false);
        }}
      />
      {import.meta.env.DEV && (
        <Button
          color="red.6"
          onClick={() => {
            audioRef.current?.pause();
            mediaTrack.setPlayStatus(false);
          }}
          style={{ position: "fixed", bottom: 150, right: 150, zIndex: 999 }}
        >
          Stop All Audio
        </Button>
      )}
    </BackgroundImage>
  );
}
