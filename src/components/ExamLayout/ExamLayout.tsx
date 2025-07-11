import { Outlet } from "react-router-dom";
import { useExamProgress } from "~/stores/exam-progress";
import { Navbar } from "~/components/Navbar/Navbar";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";

export function ExamLayout() {
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
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (e.clientY <= 10) {
      headerHandler.open();
    }
  }

  return (
    <div
      className="flex flex-col h-screen w-screen bg-[#AFCBE0] items-center"
      onMouseMove={handleHeaderTrigger}
    >
      <Navbar
        inView={inView}
        onMouseLeave={headerHandler.close}
      />
      {/*
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
      
         TODO: definir se continuará a ser usado a barra de progresso
      */}
      <Outlet />
    </div>
  );
}
