/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import { useDownloadLottieFile } from "~/api/lottie";
import { AudioButton } from "~/components/AudioButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model16({ question, setContinueDisabled }: ModelProps) {
  const { audioTitles, lottieTitles } = useQuestionHelper(question);

  const { data }: { data: any } = useDownloadLottieFile(
    lottieTitles[0]?.file_id || "",
    {
      enabled: !!lottieTitles[0]?.file_id,
    }
  );
  const [modifiedData, setModifiedData] = useState<any | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CANVAS_SIZE = boardW(450);
  const skipLottie = question.rules.find((rule) => rule.name === "skipLottie");

  useEffect(() => {
    if (data && skipLottie) {
      const outlineLayer = data.layers.find((layer: any) =>
        layer.nm.includes("outline")
      );
      const updatedData = outlineLayer
        ? { ...data, layers: [outlineLayer] }
        : data;
      setModifiedData(updatedData);
    } else {
      setModifiedData(data);
    }
  }, [data, skipLottie]);

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

  const audioRef = useRef<HTMLAudioElement>(null);
  const { start } = useTimeout(() => {
    void audioRef.current?.play();
  }, 4000);

  useEffect(() => {
    start();
    setContinueDisabled(false);
  }, [question]);

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
                autoPlay={false}
                ref={audioRef}
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

        {modifiedData && (
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: modifiedData,
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
