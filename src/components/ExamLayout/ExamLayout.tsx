import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { useExamProgress } from "~/stores/exam-progress";
import { BackgroundImage, Box, Button, Center, Progress } from "@mantine/core";
import { Navbar } from "~/components/Navbar/Navbar";
import sala_3000 from "~/assets/bgs/sala_3000x900.png";
import lousa from "~/assets/bgs/lousa-sala1.svg";
import { LottiesExam } from "./LottiesExam";

export function ExamLayout() {
  const progressBarHeight = (lousaHeight * 3) / 100;
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

  useEffect(() => {
    audioRef.current && audioRef.current.setAttribute("src", "");
  }, []);

  return (
    <BackgroundImage
      src={sala_3000}
      mih="100vh"
      p={0}
      styles={{ main: { padding: 0, position: "relative" } }}
    >
      <Navbar />
      <Center style={{ position: "relative" }}>
        <Progress
          value={examProgress}
          w={lousaWidth * 0.95}
          style={{ position: "absolute", top: progressBarHeight }}
          size="lg"
          striped
          animate
          radius="xl"
        />
        <BackgroundImage
          src={lousa}
          h={lousaHeight}
          w={lousaWidth}
          mt={(progressBarHeight * 22) / 100}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          <Box
            w={(lousaWidth * 94) / 100}
            h={(lousaHeight * 86) / 100}
            mt={(progressBarHeight * 350) / 100}
          >
            <Outlet />
          </Box>
        </BackgroundImage>
      </Center>

      <LottiesExam />

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
