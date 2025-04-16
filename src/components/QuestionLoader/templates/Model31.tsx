import { Title } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
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

export function Model31({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { imageTitles, textTitles } = useQuestionHelper(question);
  const statement = textTitles[0]?.description ?? "MISSING_TITLE";

  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>([]);
  const [stack, setStack] = useState<QuestionOption[]>([]);
  const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDrop(option: QuestionOption | null, targetIndex: number) {
    if (!option) return;

    setAnswers((state) =>
      produce(state, (draft) => {
        draft[targetIndex] = option
          ? { ...option, positionAnswer: targetIndex }
          : null;
      })
    );
    setStack(
      stack.filter((item) => {
        return JSON.stringify(item) !== JSON.stringify(option);
      })
    );
  }

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current) {
      const option: QuestionOption = e.active.data.current.option;

      setActiveDrag(() => option);
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

  function handleClearAnswer(optionIndex: number) {
    const removedAnswer = answers[optionIndex];
    if (!removedAnswer) return;

    setAnswers(
      produce(answers, (draft) => {
        draft[optionIndex] = null;
      })
    );

    const { positionAnswer, ...cleanAnswer } = removedAnswer;

    const fullOption = options.find((opt) => {
      return JSON.stringify(opt) === JSON.stringify(cleanAnswer);
    });

    if (fullOption) {
      setStack((prevStack) => [fullOption, ...prevStack]);
    }
  }

  useEffect(() => {
    setStack(options);
    setAnswers(question.options.map(() => null));
  }, [question, statement]);

  useEffect(() => {
    setOptions(question.options);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers.filter((ans) => ans !== null));
  }, [answers]);

  const conditions = useMemo(
    () => [answers.length === question.options.length],
    [answers, question]
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
      <div className="flex flex-col items-center justify-evenly w-full h-full p-4 border border-red-600">
        <Title
          color="dark.3"
          className="flex items-center justify-center w-full text-lg font-semibold text-center border border-red-600"
        >
          {statement}
        </Title>
        <div className="flex flex-col lg:flex-row items-center justify-center w-full h-[60%] lg:h-[50%] border border-red-600">
          {imageTitles
            .filter((title) => title.file_url)
            .map((imageTitle, inx) => (
              <div
                className="flex items-center flex-row lg:flex-col h-1/3 lg:h-full w-full border border-red-600 p-4"
                key={inx}
              >
                <img
                  className="max-h-full h-[80%] lg:h-[75%] pb-2"
                  src={imageTitle.file_url!}
                />
                <DroppablePictureCardBasic
                  id={inx}
                  key={inx}
                  optionItem={answers[inx] || null}
                  className="flex w-full h-full items-center justify-center rounded-[20px] bg-[#4c494120]"
                  replaceWith={
                    answers[inx] && (
                      <DraggableCardBasic
                        id={answers[inx].description}
                        key={answers[inx].description}
                        optionItem={answers[inx]}
                        text={answers[inx].description}
                        sound={answers[inx].sound_url}
                        debug={{
                          debugProperty: "position",
                        }}
                        onClear={() => handleClearAnswer(inx)}
                        className="w-full px-8 py-4 text-center rounded-[20px]"
                        disabled
                      />
                    )
                  }
                />
              </div>
            ))}
        </div>

        {stack[0] && (
          <DraggableCardBasic
            id={stack[0].description}
            key={stack[0].description}
            optionItem={stack[0]}
            text={stack[0].description}
            sound={stack[0].sound_url}
            debug={{
              debugProperty: "position",
            }}
            className="min-w-1/3 px-8 py-4 text-center"
          />
        )}

        <DragOverlay className="">
          {activeDrag && (
            <DraggableCardBasic
              id={activeDrag.description}
              optionItem={activeDrag}
              text={activeDrag.description}
              sound={activeDrag.sound_url}
              debug={{ skipDebug: true }}
              className="min-w-1/3 px-8 py-4 text-center"
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
