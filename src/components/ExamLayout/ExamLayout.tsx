import { Outlet } from "react-router-dom";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useExamProgress } from "~/stores/exam-progress";
import { BackgroundImage, Box, Center, Progress } from "@mantine/core";
import { Navbar } from "~/components/Navbar/Navbar";
import sala_3000 from "~/assets/bgs/sala_3000x900.png";
import lousa from "~/assets/bgs/lousa-sala1.svg";
import { LottiesExam } from "./LottiesExam";

export function ExamLayout() {
  const progressBarHeight = (lousaHeight * 3) / 100;
  const examProgress = useExamProgress((state) => state.value);

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
    </BackgroundImage>
  );
}
