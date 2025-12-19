import { produce } from "immer";
import { useEffect, useMemo, useState, useRef } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
  DraggableCardBasic,
  DroppablePictureCardBasic,
} from "~/components/dnd";

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

type OptionWithSound = QuestionOption & {
  id: string;
  sound?: Howl;
};

export function QORD3x2({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>([
    null,
    null,
  ]);

  const { audioTitles, hasAudioTitle, audioTitleAutoplay, getRule } =
    useQuestionHelper(question);

  const auxAutoPlayRule = getRule("auxAutoPlay");
  const shouldPlayAux = auxAutoPlayRule?.value === "false" ? false : true;

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxRef = useRef<AudioButtonRef>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

  function handleDrop(option: OptionWithSound | null, targetIndex: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        let opt: QuestionOption | null = null;
        if (option) {
          const { id: _id, sound: _sound, ..._option } = option;
          opt = _option;
        }

        /* @ts-ignore */
        draft[targetIndex] = option
          ? { ...opt, positionAnswer: targetIndex }
          : null;
      })
    );
  }

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current) {
      const option: OptionWithSound = e.active.data.current.option;
      if (!option.sound?.playing()) {
        option.sound?.play();
      }
      setActiveDrag(() => option);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveDrag(null);
    if (e.over) {
      const targetIndex = Number(e.over.id);
      const option = (e.active.data.current?.option as QuestionOption) ?? null;
      handleDrop(option as OptionWithSound, targetIndex);
    }
  }

  function handleClearAnswer(optionIndex: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[optionIndex] = null;
      })
    );
  }

  const conditions = useMemo(
    () => [answers.every((answer) => answer !== null)],
    [answers]
  );

  useEffect(() => {
    if (mainAudioRef.current && auxRef.current) {
      if (shouldPlayAux) {
        mainAudioRef.current.sound.onEnd(() => {
          auxRef.current?.sound.play();
        });
      }
    }
  }, [mainAudioRef, auxRef]);

  useEffect(() => {
    setAnswers([null, null]);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers.filter((answer) => answer !== null));
  }, [answers]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      {hasAudioTitle && (
        <div>
          {audioTitles.map((title, inx) => (
            <AudioButton
              index={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url ?? ""}
              key={title.file_url}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-evenly flex-1 w-full">
        <div className="flex items-center justify-center w-full md:w-2/3 lg:w-1/2 p-4 m-4">
          {answers.map((slot, inx) => {
            return (
              <DroppablePictureCardBasic
                id={inx}
                key={inx}
                optionItem={answers[inx] || null}
                className="flex w-full aspect-video mx-4 items-center justify-center rounded-[20px] bg-[#4c494120]"
                replaceWith={
                  answers[inx] && (
                    <DraggableCardBasic
                      id={answers[inx].id}
                      key={answers[inx].id}
                      optionItem={answers[inx]}
                      image={answers[inx].image_url}
                      sound={answers[inx].sound_url}
                      debug={{
                        skipDebug: true,
                      }}
                      onClear={() => handleClearAnswer(inx)}
                      className="flex w-full aspect-video mx-4 items-center justify-center rounded-[20px] opacity-1"
                      disabled
                    />
                  )
                }
              />
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4 place-content-center place-items-center w-full md:w-2/3 lg:w-1/2 p-4 m-4">
          {question.options.map((option, inx) => (
            <DraggableCardBasic
              id={option.id}
              key={option.id}
              optionItem={option}
              image={option.image_url}
              text={option.description}
              sound={option.sound_url}
              debug={{ skipDebug: true }}
              className="min-w-full aspect-video px-8 py-4 text-center"
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeDrag && (
          <DraggableCardBasic
            id={activeDrag.id}
            optionItem={activeDrag}
            image={activeDrag.image_url}
            sound={activeDrag.sound_url}
            debug={{ skipDebug: true }}
            className="min-w-full aspect-video px-8 py-4 text-center opacity-50"
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
