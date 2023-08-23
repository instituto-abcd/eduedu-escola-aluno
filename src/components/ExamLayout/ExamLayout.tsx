import { BackgroundImage, Center, Image, Progress } from "@mantine/core";
import { Outlet } from "react-router-dom";
import bgProva from "~/assets/bgs/bg_prova2.png";
import lousa from "~/assets/bgs/lousa.svg";
import carteiras from "~/assets/bgs/carteiras.png";
import { useExamProgress } from "~/stores/exam-progress";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { useEffect, useRef } from "react";

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

  return (
    <BackgroundImage
      src={bgProva}
      maw={1440}
      mih="100vh"
      mx="auto"
      p={0}
      styles={{ main: { padding: 0, position: "relative" } }}
    >
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
      <Image
        src={carteiras}
        w="100%"
        maw={1440}
        mah={1080}
        h="auto"
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          zIndex: 555,
          marginInline: "auto",
          pointerEvents: "none",
        }}
      />
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
    </BackgroundImage>
  );
}
