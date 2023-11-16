import { Group } from "@mantine/core";
import { useEffect, useRef } from "react";
import Lottie from "react-lottie";
import { useDownloadLottieFile } from "~/api/lottie";
import { AudioButton } from "~/components/AudioButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model16({ question, setContinueDisabled }: ModelProps) {
  const { audioTitles, lottieTitles, audioTitleAutoplay, hasAudioTitle } =
    useQuestionHelper(question);

  const { data } = useDownloadLottieFile(lottieTitles[0]?.file_id || "", {
    enabled: !!lottieTitles[0]?.file_id,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CANVAS_SIZE = boardW(450);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;

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

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
  }, [question]);

  useEffect(() => {
    setContinueDisabled(false);
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              src={title.file_url!}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </Group>
      )}

      <Group
        position="apart"
        spacing={137}
        style={{ position: "relative", isolation: "isolate" }}
        my="auto"
      >
        <canvas ref={canvasRef} />

        {data && (
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: data,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: -1,
            }}
          />
        )}
      </Group>
    </>
  );
}
