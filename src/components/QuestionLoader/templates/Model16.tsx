import { Group } from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lottie from "react-lottie";
import { LottieLayers, useDownloadLottieFile } from "~/api/lottie";
import { AudioButton } from "~/components/AudioButton";
import { boardW, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { IconButton } from "~/components/EduButton";
import { RubberIcon } from "~/assets/icons/Rubber";

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

      canvas.addEventListener("mousedown", (e) => {
        if (!isCompletedLottie) return;
        isDrawing = true;
        setControlDrawing(true);
        prevX = e.offsetX;
        prevY = e.offsetY;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (!isCompletedLottie) return;
        if (!isDrawing) return;

        const x = e.offsetX;
        const y = e.offsetY;

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
      });

      canvas.addEventListener("mouseup", () => {
        isDrawing = false;
        setControlDrawing(false);
      });

      canvas.addEventListener("mouseleave", () => {
        isDrawing = false;
        setControlDrawing(false);
      });
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
        !isAllColorChannelsZero && isCompletedLottie ? [] : [false],
      );
      return;
    }

    onConditionsChange([false]);
  }, [isCompletedLottie, controlDrawing]);

  const updateDataWithoutFillLayer = useCallback(() => {
    const outlineLayer = data?.layers.filter(
      (layer) => !layer.nm.includes("fill"),
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

  const rubberIcon = useMemo(
    () => <RubberIcon width={lousaWidth * 0.05} height={lousaWidth * 0.05} />,
    [],
  );

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              src={title.file_url!}
              autoPlay={isCompletedLottie && audioTitleAutoplay(inx)}
            />
          ))}
          <IconButton
            variant="gray"
            icon={rubberIcon}
            onClick={cleanUp}
            disabled={false}
          />
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
    </>
  );
}
