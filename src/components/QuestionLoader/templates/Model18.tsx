import { useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { ReadButton } from "~/components/ReadButton";
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
import { v4 as uuid } from "uuid";

export function Model18({
  question,
  onAnswerChange,
  onConditionsChange,
  auxQuestion,
}: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);
  const { imageTitles, textTitles, hasAudioTitle, supportText } =
    useQuestionHelper(question);

  const text = useMemo(
    () =>
      textTitles.filter(
        (title) =>
          title.description &&
          title.description.length > 0 &&
          title.description.includes("_")
      )[0].description,
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
      setSelected((prevSelected) =>
        prevSelected.concat({
          ...item,
          positionAnswer: index,
        })
      );
    }
  }

  function handleClear(index: number) {
    handleDrop(null, index);
    setSelected(selected.filter((_) => _.positionAnswer !== index));
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
    onAnswerChange(selected);
  }, [selected]);

  const conditions = useMemo(
    () => [slots.every((slot) => slot !== null)],
    [slots]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const textAboveQuestion = textTitles.filter((t) =>
    t.placeholder?.includes("som")
  )[0];

  const hasSupportText = supportText.some((title) => !!title.description);

  // DND Related
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

  const questionOptions = useMemo(
    () => makeOptions(question.options),
    [question]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Enunciado em botões (header) */}
      {(hasAudioTitle || hasSupportText) && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-evenly grow size-full">
        {/* Enunciado textual (opcional) */}
        <div className="flex flex-col w-full h-full items-center justify-center">
          {textAboveQuestion && (
            <TextTitle text={textAboveQuestion.description} />
          )}

          {/* Enunciado em imagem */}
          <ImageTitle titles={imageTitles} />
        </div>

        <div className="flex flex-col items-center justify-evenly lg:justify-center gap-4 lg:gap-20 w-full h-full">
          {/* Texto a ser completado */}
          <div className="flex items-center justify-center gap-1 md:gap-3 w-full">
            {slots.map((slot, inx) => {
              if (typeof slot === "string")
                return (
                  <div
                    key={inx}
                    className="font-black text-4xl md:text-5xl text-text"
                  >
                    {slot}
                  </div>
                );

              return (
                <DroppableLetter
                  id={inx}
                  key={inx}
                  replaceWith={
                    slot && (
                      <DraggableLetter
                        id={inx}
                        optionItem={slot!}
                        disabled
                        onClear={() => handleClear(inx)}
                        dropped
                      />
                    )
                  }
                />
              );
            })}
          </div>

          {/* Alternativas */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[400px]">
            {questionOptions.map((option, inx) => (
              <DraggableLetter
                key={inx}
                id={option.id}
                optionItem={option}
                hidden={
                  !!slots.find(
                    (item) =>
                      item &&
                      typeof item !== "string" &&
                      JSON.stringify(item) === JSON.stringify(option)
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

function makeOptions(
  data: QuestionOption[]
): Array<QuestionOption & { id: string }> {
  const options = data.map((o) => ({
    ...o,
    id: uuid(),
  }));

  return options;
}
