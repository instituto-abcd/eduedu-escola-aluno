import { Group, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { Answer, useGetExamQuestion } from "~/api/student";
import { QuestionOption } from "~/api/exam";
import { EduButton } from "~/components/EduButton";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { produce } from "immer";

type Slot = null | QuestionOption;

export function QORD3x2({ question, answerCallback }: ModelProps) {
  const [selected, setSelected] = useState<Answer[]>([]);
  const disabled = selected.length < 2;

  const [slots, setSlots] = useState<Slot[]>([null, null]);

  function selectItem(_answer: QuestionOption) {
    const answer = {
      position: _answer.position,
      positionAnswer: _answer.position,
    };

    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          position: _answer.position,
          positionAnswer: _answer.position,
        },
      ]);
    }
  }

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (disabled) return;

    mutate({
      questionId: question.id,
      optionsAnswered: selected,
    });
  }

  function handleDrop(item: QuestionOption | null, index: number) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );

    if (item) {
      setSelected((state) =>
        produce(state, (draft) => {
          draft[index] = {
            position: item.position,
            positionAnswer: index,
          };
        })
      );
    }
  }

  function handleClear(index: number) {
    handleDrop(null, index);
    setSelected(selected.filter((_, inx) => inx !== index));
  }

  const { audioTitles } = useQuestionHelper(question);

  useEffect(() => {
    setSelected([]);
    setSlots([null, null]);
  }, [question]);

  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton autoPlay src={title.file_url ?? ""} key={title.file_url} />
      ))}

      <Group noWrap grow spacing={75} py={40}>
        {question.titles
          .filter((title) => title.type === "TEXT")
          .map((title) => (
            <Text key={title.position} size="lg">
              {title.description}
            </Text>
          ))}
      </Group>

      <Group>
        {slots.map((slot, inx) => (
          <DragLetterSlot
            key={inx}
            onDrop={(item) => handleDrop(item, inx)}
            option={slot}
            onClear={() => handleClear(inx)}
          />
        ))}
      </Group>

      <SimpleGrid cols={3} style={{ placeItems: "center" }} spacing={24}>
        {question.options
          .sort((a, b) => a.position - b.position)
          .map((option) => (
            <DraggableLetters
              key={option.position}
              onClick={() => selectItem(option)}
              option={option}
            />
          ))}
      </SimpleGrid>

      <EduButton
        disabled={disabled}
        onClick={submitAnswer}
        style={{ marginTop: "auto" }}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
