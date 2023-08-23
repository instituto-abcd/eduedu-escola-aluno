import { Group, LoadingOverlay, SimpleGrid } from "@mantine/core";
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
import { TextOptionButton } from "~/components/OptionButton";

type Slot = string | null | QuestionOption;

export function QORD3x2({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles } = useQuestionHelper(question);
  const startingSlots =
    textTitles.length > 0
      ? textTitles[0].description
          .split("")
          .map((char) => (char === "_" ? null : char))
      : [null, null];

  const [selected, setSelected] = useState<Answer[]>([]);

  const [slots, setSlots] = useState<Slot[]>(startingSlots);
  const disabled =
    selected.filter(Boolean).length <
    slots.filter((slot) => typeof slot !== "string").length;

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

  useEffect(() => {
    setSelected([]);
    setSlots(startingSlots);
    // só pra essa linha, pois o comportamento é intencional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton autoPlay src={title.file_url ?? ""} key={title.file_url} />
      ))}

      <Group mt="auto">
        {slots.map((slot, inx) => {
          if (typeof slot === "string")
            return <TextOptionButton key={slot}>{slot}</TextOptionButton>;

          return (
            <DragLetterSlot
              key={inx}
              onDrop={(item) => handleDrop(item, inx)}
              option={slot}
              onClear={() => handleClear(inx)}
            />
          );
        })}
      </Group>

      <SimpleGrid
        cols={3}
        style={{ placeItems: "center" }}
        spacing={24}
        mb="auto"
      >
        {question.options.map((option) => (
          <DraggableLetters
            key={option.position}
            option={option}
            hidden={
              !!slots.find(
                (item) =>
                  item &&
                  typeof item !== "string" &&
                  item.position === option.position
              )
            }
          />
        ))}
      </SimpleGrid>
      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
