import { Group } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import { LottieLayers, useDownloadLottieFile } from "~/api/lottie";
import { AudioButton } from "~/components/AudioButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { ButtonErase } from "~/components/Buttons";

export function Model16({ question, onConditionsChange }: ModelProps) {
  const {
    audioTitles,
    lottieTitles,
    audioTitleAutoplay,
    hasAudioTitle,
    getRule,
  } = useQuestionHelper(question);

  const { data } = useDownloadLottieFile(lottieTitles[0]?.file_id || "", {
    enabled: !!lottieTitles[0]?.file_id,
  });
  const [modifiedData, setModifiedData] = useState<LottieLayers>();
  const [isCompletedLottie, setIsCompletedLottie] = useState(false);
  const [controlDrawing, setControlDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CANVAS_SIZE = boardW(450);
  const skipLottie = getRule("skipLottie")?.value === "true";

  useEffect(() => {
    if (data && skipLottie) {
      updateDataWithoutFillLayer();
    } else {
      setModifiedData(data);
    }
  }, [data, skipLottie]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;

      let isDrawing = false;
      let prevX = 0;
      let prevY = 0;

      const getCanvasCoordinates = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (e instanceof TouchEvent) {
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
        } else {
          return {
            x: (e as MouseEvent).offsetX,
            y: (e as MouseEvent).offsetY,
          };
        }
      };

      const handleStart = (e: MouseEvent | TouchEvent) => {
        if (!isCompletedLottie) return;
        e.preventDefault();
        isDrawing = true;
        setControlDrawing(true);
        const coords = getCanvasCoordinates(e);
        prevX = coords.x;
        prevY = coords.y;
      };

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isCompletedLottie || !isDrawing) return;
        e.preventDefault();

        const coords = getCanvasCoordinates(e);
        const x = coords.x;
        const y = coords.y;

        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#4CB9E7";

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        prevX = x;
        prevY = y;
      };

      const handleEnd = () => {
        isDrawing = false;
        setControlDrawing(false);
      };

      canvas.addEventListener("mousedown", handleStart);
      canvas.addEventListener("mousemove", handleMove);
      canvas.addEventListener("mouseup", handleEnd);
      canvas.addEventListener("mouseleave", handleEnd);

      canvas.addEventListener("touchstart", handleStart);
      canvas.addEventListener("touchmove", handleMove);
      canvas.addEventListener("touchend", handleEnd);
      canvas.addEventListener("touchcancel", handleEnd);

      return () => {
        canvas.removeEventListener("mousedown", handleStart);
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("mouseup", handleEnd);
        canvas.removeEventListener("mouseleave", handleEnd);

        canvas.removeEventListener("touchstart", handleStart);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("touchend", handleEnd);
        canvas.removeEventListener("touchcancel", handleEnd);
      };
    }
  }, [canvasRef, isCompletedLottie]);

  useEffect(() => {
    cleanUp();
  }, [question]);

  useEffect(() => {
    updateConditions();
  }, [isCompletedLottie, controlDrawing]);

  const updateConditions = useCallback(() => {
    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      const isAllColorChannelsZero = !currentCanvas
        .getContext("2d", { willReadFrequently: true })
        ?.getImageData(0, 0, currentCanvas.width, currentCanvas.height)
        .data.some((channel) => channel !== 0);
      onConditionsChange(
        !isAllColorChannelsZero && isCompletedLottie ? [] : [false]
      );
      return;
    }

    onConditionsChange([false]);
  }, [isCompletedLottie, controlDrawing]);

  const updateDataWithoutFillLayer = useCallback(() => {
    const outlineLayer = data?.layers.filter(
      (layer) => !layer.nm.includes("fill")
    );
    const updatedData = outlineLayer ? { ...data, layers: outlineLayer } : data;
    setModifiedData(updatedData);
    setIsCompletedLottie(true);
  }, [data]);

  const cleanUp = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      updateConditions();
    }
  };

  return (
    <Group className="flex flex-col flex-1 w-full">
      {hasAudioTitle && (
        <Group className="flex flex-col md:flex-row items-center w-full">
          <Group className="md:absolute z-10">
            {audioTitles.map((title, inx) => (
              <AudioButton
                index={inx}
                key={inx}
                src={title.file_url!}
                autoPlay={isCompletedLottie && audioTitleAutoplay(inx)}
              />
            ))}
          </Group>
          <Group className="z-10 flex relative top-10 sm:top-20 md:top-auto md:flex-1 justify-center items-center">
            <ButtonErase
              onClick={cleanUp}
              disabled={false}
            />
          </Group>
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
            eventListeners={[
              {
                eventName: "complete",
                callback: () => updateDataWithoutFillLayer(),
              },
            ]}
          />
        )}
      </Group>
    </Group>
  );
}
