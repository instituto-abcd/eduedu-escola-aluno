import { useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";
import { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DraggableLetter, DroppableLetter } from "~/components/dnd";
import { TextTitle } from "~/components/question-components/TextTitle";
import { ImageTitle } from "~/components/question-components";
import { AudioButton } from "~/components/AudioButton";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";

/**
 * IMPORTANTE: este modelo difere do modelo 18 dos planetas, pois a logica de resposta é diferente.
 * No modelo 18 padrão as alternativas corretas de letras são ordenadas de acordo com a posição na palavra do enunciado
 * ja no modelo 18 prova, as alternativas corretas de letras são ordenadas de acordo com a posição no array de resposta.
 **/

export function Model18Prova({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);
  const { imageTitles, textTitles, hasAudioTitle, supportText, audioTitles } =
    useQuestionHelper(question);

  const mainAudioRef = useRef<AudioButtonRef>(null);

  const text = useMemo(
    () =>
      textTitles.find(
        (title) => title.description && title.description.includes("_")
      )?.description ?? "",
    [question]
  );

  const [slots, setSlots] = useState<Array<QuestionOption | null | string>>(
    () =>
      text
        .replace(/\s/g, "")
        .split("")
        .map((char) => (char === "_" ? null : char))
  );

  function handleDrop(item: QuestionOption | null, index: number) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );

    if (item) {
      setSelected((prev) =>
        prev.concat({
          ...item,
          positionAnswer: index,
        })
      );
    }
  }

  function handleClear(index: number) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = null;
      })
    );
    setSelected((prev) => prev.filter((opt) => opt.positionAnswer !== index));
  }

  useEffect(() => {
    setSelected([]);
    setSlots(
      text
        .replace(/\s/g, "")
        .split("")
        .map((char) => (char === "_" ? null : char))
    );
  }, [question]);

  useEffect(() => {
    const respostaOrdenada = slots
      .filter((slot) => slot && typeof slot !== "string")
      .map((slot, idx) => ({
        ...(slot as QuestionOption),
        positionAnswer: idx,
      }));

    onAnswerChange(respostaOrdenada);
  }, [slots]);

  const conditions = useMemo(
    () => [slots.every((slot) => slot !== null)],
    [slots]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const textAboveQuestion = textTitles.find((t) =>
    t.placeholder?.includes("som")
  );

  const hasSupportText = supportText.some((t) => !!t.description);

  // DND
  const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current) {
      const option: QuestionOption = e.active.data.current.option;
      setActiveDrag(option);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveDrag(null);
    if (e.over) {
      const targetIndex = Number(e.over.id);
      const option = (e.active.data.current?.option as QuestionOption) ?? null;
      handleDrop(option, targetIndex);
    }
  }

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Enunciado em áudio (header) */}
      {hasAudioTitle &&
        audioTitles.map((title, idx) => (
          <AudioButton
            key={title.file_url}
            index={idx}
            src={title.file_url ?? ""}
            autoPlay
            ref={mainAudioRef}
          />
        ))}

      <div className="flex flex-col lg:flex-row items-center justify-evenly grow size-full">
        {/* Enunciado textual (opcional) */}
        <div className="flex flex-col w-full h-full items-center justify-center">
          {textAboveQuestion && (
            <TextTitle text={textAboveQuestion.description} />
          )}
          {/* Imagem enunciado */}
          <ImageTitle titles={imageTitles} />
        </div>

        <div className="flex flex-col items-center justify-evenly lg:justify-center gap-4 lg:gap-20 w-full h-full">
          {/* Texto a ser completado */}
          <div className="flex items-center justify-center gap-1 md:gap-3 w-full">
            {slots.map((slot, idx) => {
              if (typeof slot === "string") {
                return (
                  <div
                    key={idx}
                    className="font-black text-4xl md:text-5xl text-text"
                  >
                    {slot}
                  </div>
                );
              }
              return (
                <DroppableLetter
                  key={idx}
                  id={idx}
                  replaceWith={
                    slot && (
                      <DraggableLetter
                        id={idx}
                        optionItem={slot}
                        disabled
                        onClear={() => handleClear(idx)}
                        dropped
                        compact={slots.length > 4}
                      />
                    )
                  }
                />
              );
            })}
          </div>

          {/* Alternativas */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[400px]">
            {question.options.map((option, idx) => (
              <DraggableLetter
                key={idx}
                id={option.id}
                optionItem={option}
                hidden={
                  !!slots.find(
                    (s) =>
                      s &&
                      typeof s !== "string" &&
                      JSON.stringify(s) === JSON.stringify(option)
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Overlay DND */}
      <DragOverlay>
        {activeDrag ? (
          <DraggableLetter
            id={54321}
            optionItem={activeDrag}
            disabled
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
