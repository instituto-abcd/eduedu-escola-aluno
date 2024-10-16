import { Outlet } from "react-router-dom";
import { useExamProgress } from "~/stores/exam-progress";
import { createStyles, Progress, Stack } from "@mantine/core";
import { Navbar } from "~/components/Navbar/Navbar";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";

export function ExamLayout() {
  const { classes } = useStyles();

  // Progressbar handlers
  const examProgress = useExamProgress();
  useEffect(() => {
    return () => {
      examProgress.setValue(0);
    };
  }, []);

  // Navbar - header handlers
  const [inView, headerHandler] = useDisclosure(false);
  function handleHeaderTrigger(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    if (e.clientY <= 10) {
      headerHandler.open();
    }
  }

  return (
    <Stack className={classes.container} onMouseMove={handleHeaderTrigger}>
      <Navbar inView={inView} onMouseLeave={headerHandler.close} />
      <Progress
        value={examProgress.value}
        w={400} // TODO: calcular w
        styles={{
          bar: {
            transitionProperty: "width",
            transitionDuration: "1.5s",
            transitionTimingFunction: "ease-in-out",
          },
        }}
        size="lg"
        striped
        animate
        radius="xl"
      />
      <Outlet />
    </Stack>
  );
}

const useStyles = createStyles({
  container: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#AFCBE0",
    alignItems: "center",
  },
});
