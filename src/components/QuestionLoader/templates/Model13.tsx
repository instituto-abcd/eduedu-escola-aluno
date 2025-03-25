import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioInterface } from "~/sounds";
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
import { DroppableContents } from "~/components/dnd/droppable-contents";
import {
  DraggableStack,
  DraggableStackItem,
} from "~/components/dnd/draggable-stack";
import { TextTitle } from "~/components/question-components/TextTitle";
import { AudioContainer } from "~/components/AudioContainer";
import { validString } from "~/utils/string";
import { v4 as uuid } from "uuid";

type OptionWithSound = QuestionOption & {
  id: string;
  sound?: Howl;
};

export function Model13({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  /* Map options with sound */
  const [options, setOptions] = useState<OptionWithSound[]>([]);
  const { textTitles, getRule, hasAudioTitle } = useQuestionHelper(question);

  /* Answer */
  const [answers, setAnswers] = useState<QuestionOption[]>([]);

  function handleAnswer(item: OptionWithSound, title: QuestionTitle) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft.push(item);
      })
    );

    setOptions((state) =>
      produce(state, (draft) => {
        const index = draft.findIndex((opt) => opt.id === item.id);

        draft.splice(index, 1);
      })
    );

    handleFeedbackSound(title, item);
  }

  function handleFeedbackSound(title: QuestionTitle, option: QuestionOption) {
    if (+title.position === +option.position) {
      AudioInterface.feedback.positive.play();
    } else {
      AudioInterface.feedback.negative.play();
    }
  }

  /* Rules */
  const showOptionsText = getRule("showOptionsText");
  const imageOnly = showOptionsText ? showOptionsText.value === "true" : false;

  /* Targets */
  const targetTitles = question.titles.filter(
    (title) =>
      title.type === "IMAGE" &&
      (title.file_url || validString(title.description))
  );

  /* Drag Handlers */
  const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current) {
      const option: OptionWithSound = e.active.data.current.option;
      if (option.sound && !option.sound.playing()) {
        option.sound.play();
      }
      setActiveDrag(() => option);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveDrag(null);
    if (e.over) {
      const titleId = Number(e.over.id);
      const title = targetTitles.find(({ position }) => position === titleId);

      const option = e.active.data.current?.option as OptionWithSound;
      handleAnswer(option, title!);
    }
  }

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  /* Conditions (continue) */
  useEffect(() => {
    setAnswers([]);
    setOptions(
      question.options.map((option) => ({
        ...option,
        id: uuid(),
        sound: new Howl({
          src: [option.sound_url ?? ""],
          html5: true,
          format: ["mp3"],
          loop: false,
        }),
      }))
    );
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers);
  }, [answers]);

  const conditions = useMemo(
    () => [answers.length === question.options.length],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      {/* Audio tracks */}
      {hasAudioTitle && <AudioContainer question={question} />}

      {/* Question Title */}
      {textTitles.map((title) => (
        <TextTitle text={title.description} />
      ))}

      {/* Main content container*/}
      <div className="flex flex-col size-full max-w-screen-lg justify-evenly items-center gap-4 lg:flex-row">
        {/* Top (left) row (targets) */}
        <div className="flex lg:flex-col flex-1 items-center gap-4 lg:gap-24">
          {targetTitles.slice(2, 4).map((target, inx) => (
            <DroppableContents
              key={inx}
              id={target.position}
              text={target.description}
              image={target.file_url ?? undefined}
            />
          ))}
        </div>

        {/* Card stacks (draggable, question option) */}
        <div className="flex-none justify-center basis-1/2 w-full">
          <DraggableStack options={options} />
        </div>

        {/* Bottom (right) row (targets) */}
        <div className="flex lg:flex-col flex-1 items-center gap-4 lg:gap-24">
          {targetTitles.slice(0, 2).map((target, inx) => (
            <DroppableContents
              key={inx}
              id={target.position}
              text={target.description}
              image={target.file_url ?? undefined}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        <DraggableStackItem
          optionItem={activeDrag!}
          id={542321}
          small
        />
      </DragOverlay>
    </DndContext>
  );
}
