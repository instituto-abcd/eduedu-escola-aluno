// Utils & Aux:
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { lousaHeight, lousaWidth } from "~/utils/userScreen";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { useExamProgress } from "~/stores/exam-progress";

// Components:
import {
  BackgroundImage,
  Button,
  Center,
  Progress,
} from "@mantine/core";
import { Navbar } from "~/components/Navbar/Navbar";

// Images:
import sala_3000 from "~/assets/bgs/sala_3000x900.png";
import lousa from "~/assets/bgs/lousa-sala1.svg";
import { LottiesExam } from "./LottiesExam";

export function ExamLayout() {

  // Getting progressbar position based on blackboard position which is based on user screen width:
  const progressBarHeight = lousaHeight * 3 / 100

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

  const [bgProva, setBgProva] = useState("");

  useEffect(() => {
    setBgProva(sala_3000);
    audioRef.current && audioRef.current.setAttribute("src", "");
  }, []);

  return (
    <BackgroundImage
      src={bgProva}
      mih="100vh"
      p={0}
      styles={{ main: { padding: 0, position: "relative" } }}
    >
      <Navbar />
      <Center style={{ position: "relative" }}>
        <Progress
          value={examProgress}
          w="50%"
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
          mt={progressBarHeight * 30 / 100}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          <Center
            w={lousaWidth * 90 / 100}
            h={lousaHeight * 88 / 100}
            mt={progressBarHeight * 350 / 100}
          >
            <Outlet />
          </Center>
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
