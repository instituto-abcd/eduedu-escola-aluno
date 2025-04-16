import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { QuestionOption } from "~/api/exam";
import { useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";
import { ReadButton } from "~/components/ReadButton";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { v4 as uuid } from "uuid";
import {
  DraggablePictureCardBasic,
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
import { cx } from "~/utils/cx";

type OptionWithSound = QuestionOption & {
  id: string;
  sound?: Howl;
};

export function Model19({
  question,
  onAnswerChange,
  onConditionsChange,
  auxQuestion,
}: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>([]);
  const [stack, setStack] = useState<OptionWithSound[]>([]);
  const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

  const targetLettersRule = question.rules.find(
    (rule) => rule.name === "show_targets_letters"
  );
  const showTargetLetters = Boolean(
    targetLettersRule === undefined
      ? true
      : targetLettersRule.value === "false"
      ? false
      : true
  );

  const lettersTitle = question.titles.find((title) => title.type === "TEXT");
  const targetLetters = lettersTitle?.description.split(" ") ?? [];
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const optionsWithIds = useMemo(
    () =>
      question.options.map((option) => ({
        ...option,
        id: uuid(),
        sound: new Howl({
          src: [option.sound_url ?? ""],
          html5: true,
          format: ["mp3"],
          loop: false,
        }),
      })),
    [question]
  );

  useEffect(() => {
    setStack(optionsWithIds);
    setAnswers(question.options.map(() => null));
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers.filter((ans) => ans !== null));
  }, [answers]);

  const conditions = useMemo(
    () => [answers.every((ans) => ans !== null)],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  function handleDrop(option: OptionWithSound | null, targetIndex: number) {
    if (!option) return;

    const { id, sound, ...cleanOption } = option;

    setAnswers((state) =>
      produce(state, (draft) => {
        draft[targetIndex] = option
          ? { ...cleanOption, positionAnswer: targetIndex }
          : null;
      })
    );
    setStack(
      stack.filter((item) => {
        const { id, sound, ...cleanItem } = item;

        return JSON.stringify(cleanItem) !== JSON.stringify(cleanOption);
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
    const removedAnswer = answers[optionIndex];
    if (!removedAnswer) return;

    setAnswers(
      produce(answers, (draft) => {
        draft[optionIndex] = null;
      })
    );

    const { positionAnswer, ...cleanAnswer } = removedAnswer;

    const fullOption = optionsWithIds.find((opt) => {
      const { id, sound, ...cleanOpt } = opt;
      return JSON.stringify(cleanOpt) === JSON.stringify(cleanAnswer);
    });

    if (fullOption) {
      setStack((prevStack) => [fullOption, ...prevStack]);
    }
  }

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      {hasAudioTitle && (
        <div className="flex gap-4 lg:self-start">
          {audioTitles.map((title, inx) => (
            <AudioButton
              index={inx}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
              ref={mainAudioRef}
            />
          ))}
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </div>
      )}

      <div className="w-full h-full flex flex-col justify-evenly items-center">
        <div className="w-full flex flex-nowrap justify-center items-center">
          {answers.map((answer, inx) => (
            <DroppablePictureCardBasic
              id={inx}
              key={inx}
              optionItem={answer}
              className="flex m-[1%] md:mx-[1vw] max-w-[150px] max-h-[150px] items-center justify-center rounded-[20px] w-[30%] md:w-[16%] lg:w-[15%] aspect-square text-3xl bg-[#4c494120]"
              replaceWith={
                answer && (
                  <DraggablePictureCardBasic
                    id={+answer.position}
                    key={+answer.position}
                    optionItem={answer}
                    image={answer.image_url}
                    sound={answer.sound_url}
                    onClear={() => handleClearAnswer(inx)}
                    disabled
                    debug={{
                      skipDebug: true,
                    }}
                    className="flex m-[1%] md:mx-[1vw] max-w-[150px] max-h-[150px] items-center justify-center rounded-[20px] w-[30%] md:w-[16%] lg:w-[15%] aspect-square text-3xl bg-[#4c494120]"
                  />
                )
              }
            >
              {showTargetLetters ? targetLetters[inx] : undefined}
            </DroppablePictureCardBasic>
          ))}

          <DragOverlay className="">
            {activeDrag && (
              <DraggablePictureCardBasic
                id={32145}
                optionItem={activeDrag}
                image={activeDrag.image_url}
                text={activeDrag.description}
                sound={activeDrag.sound_url}
                debug={{ skipDebug: true }}
                disabled
              />
            )}
          </DragOverlay>
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-[25vh] md:w-[60vh] h-full items-center justify-center">
            {stack[0] && (
              <DraggablePictureCardBasic
                id={stack[0].id}
                key={stack[0].id}
                optionItem={stack[0]}
                image={stack[0].image_url}
                sound={stack[0].sound_url}
                disabled={mainAudioRef.current?.sound.playing()}
                debug={{
                  debugProperty: "position",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
