import { Group, LoadingOverlay } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import Lottie from "react-lottie";
import { useDownloadLottieFile } from "~/api/lottie";
import { useEffect, useRef } from "react";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { EduButton } from "~/components/EduButton";
import { usePlanetAnswer } from "~/api/planet";

export function Model16({ question, answerCallback }: ModelProps) {
  const { audioTitles, lottieTitles } = useQuestionHelper(question);

  const { data } = useDownloadLottieFile(lottieTitles[0]?.file_url ?? "", {
    enabled: !!lottieTitles[0]?.file_url,
    onSuccess: console.log,
  });

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [],
    });
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      canvas.width = boardW(400);
      canvas.height = boardW(400);

      let isDrawing = false;
      let prevX = 0;
      let prevY = 0;

      canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        prevX = e.offsetX;
        prevY = e.offsetY;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;

        const x = e.offsetX;
        const y = e.offsetY;

        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        prevX = x;
        prevY = y;
      });

      canvas.addEventListener("mouseup", () => {
        isDrawing = false;
      });

      canvas.addEventListener("mouseleave", () => {
        isDrawing = false;
      });
    }
  }, [canvasRef]);

  return (
    <>
      {audioTitles.filter((title) => title.file_url).length > 0 && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={inx}
                src={title.file_url!}
                autoPlay={inx === 0}
              />
            ))}
        </Group>
      )}

      <Group position="apart" spacing={137}>
        <canvas ref={canvasRef} />

        {data && (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: data,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width={400}
          />
        )}
      </Group>

      <EduButton onClick={submitAnswer}>Continuar</EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
