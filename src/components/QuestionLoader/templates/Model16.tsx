import { useCallback, useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import { LottieLayers, useDownloadLottieFile } from "~/api/lottie";
import { AudioButton } from "~/components/AudioButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { ButtonErase } from "~/components/Buttons";
import { Image } from "@mantine/core";

export function Model16({ question, onConditionsChange }: ModelProps) {
  const {
    audioTitles,
    lottieTitles,
    audioTitleAutoplay,
    hasAudioTitle,
    getRule,
    imageTitles,
  } = useQuestionHelper(question);

  const { data } = useDownloadLottieFile(lottieTitles[0]?.file_id || "", {
    enabled: !!lottieTitles[0]?.file_id,
  });

  const [modifiedData, setModifiedData] = useState<LottieLayers>();
  const [isCompletedLottie, setIsCompletedLottie] = useState(false);
  const [controlDrawing, setControlDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** 🔥 RESPONSIVIDADE: calcula o tamanho real do canvas */
  const CANVAS_SIZE = window.innerWidth < 768 ? boardW(450) : boardW(750);

  const skipLottie = getRule("skipLottie")?.value === "true";

  /** Remove a camada fill assim que o Lottie completa */
  useEffect(() => {
    if (data && skipLottie) {
      updateDataWithoutFillLayer();
    } else {
      setModifiedData(data);
    }
  }, [data, skipLottie]);

  /** Lógica de desenho */
  useEffect(() => {
    if (!canvasRef.current) return;

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
      }
      return { x: (e as MouseEvent).offsetX, y: (e as MouseEvent).offsetY };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      if (!isCompletedLottie) return;
      e.preventDefault();
      isDrawing = true;
      setControlDrawing(true);

      const { x, y } = getCanvasCoordinates(e);
      prevX = x;
      prevY = y;
    };

    const move = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !isCompletedLottie) return;
      e.preventDefault();

      const { x, y } = getCanvasCoordinates(e);

      ctx.lineWidth = 30;
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

    const end = () => {
      isDrawing = false;
      setControlDrawing(false);
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);

    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("touchmove", move);
    canvas.addEventListener("touchend", end);
    canvas.addEventListener("touchcancel", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseleave", end);

      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
      canvas.removeEventListener("touchcancel", end);
    };
  }, [isCompletedLottie, CANVAS_SIZE]);

  /** Reseta quando a questão muda */
  useEffect(() => cleanUp(), [question]);

  /** Atualiza condição de conclusão */
  useEffect(() => updateConditions(), [isCompletedLottie, controlDrawing]);

  const updateConditions = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return onConditionsChange([false]);

    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    const pixels = ctx.getImageData(0, 0, c.width, c.height).data;

    const empty = !pixels.some((p) => p !== 0);

    onConditionsChange(!empty && isCompletedLottie ? [] : [false]);
  }, [isCompletedLottie, controlDrawing]);

  /** Remove camada fill */
  const updateDataWithoutFillLayer = useCallback(() => {
    const outlineLayer = data?.layers.filter(
      (layer) => !layer.nm.includes("fill")
    );
    const updated = outlineLayer ? { ...data, layers: outlineLayer } : data;

    setModifiedData(updated);
    setIsCompletedLottie(true);
  }, [data]);

  /** Limpar canvas */
  const cleanUp = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    })!;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    updateConditions();
  };

  return (
    <div className="flex flex-col flex-1 w-full justify-center items-center">
      {hasAudioTitle && (
        <>
          {/* MOBILE: Centralizado */}
          <div className="flex md:hidden justify-center w-full z-10 top-12 absolute">
            {audioTitles.map((title, i) => (
              <AudioButton
                key={i}
                index={i}
                src={title.file_url!}
                autoPlay={isCompletedLottie && audioTitleAutoplay(i)}
              />
            ))}
          </div>

          {/* DESKTOP: posição original */}
          <div className="hidden md:flex md:absolute md:top-6 md:left-6 z-10">
            {audioTitles.map((title, i) => (
              <AudioButton
                key={i}
                index={i}
                src={title.file_url!}
                autoPlay={isCompletedLottie && audioTitleAutoplay(i)}
              />
            ))}
          </div>
        </>
      )}
      {/* 🔥 WRAPPER COM TAMANHO FIXO E SINCRONIZADO */}
      <div className="flex flex-col justify-center items-center">
        <div className="z-0 flex top-10 sm:top-20 md:top-auto md:flex-1 justify-center items-center">
          <ButtonErase
            onClick={cleanUp}
            disabled={false}
          />
        </div>
        <div
          className="flex justify-center items-center flex-1 mx-auto mt-4 mb-4"
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            position: "relative",
            isolation: "isolate",
          }}
        >
          {/* CANVAS (top layer) */}
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
              width: CANVAS_SIZE,
              height: CANVAS_SIZE,
              // position: "absolute",
              inset: 0,
              zIndex: 2,
            }}
          />

          {/* LOTTIE (middle) */}
          {modifiedData && !isCompletedLottie && (
            <Lottie
              options={{
                loop: false,
                autoplay: true,
                animationData: modifiedData,
                rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
              }}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              style={{
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 1,
              }}
              eventListeners={[
                {
                  eventName: "complete",
                  callback: () => updateDataWithoutFillLayer(),
                },
              ]}
            />
          )}

          {/* IMAGEM DE FUNDO (bottom) */}
          {imageTitles[0] && (isCompletedLottie || skipLottie) && (
            <Image
              key={imageTitles[0].file_id}
              src={imageTitles[0].file_url}
              alt={imageTitles[0].placeholder}
              className="w-full h-full self-center"
              style={{
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                objectFit: "contain",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
