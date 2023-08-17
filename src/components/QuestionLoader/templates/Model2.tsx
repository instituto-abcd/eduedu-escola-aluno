import { Group, LoadingOverlay, SimpleGrid, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { DragSlotCard, DraggableCard } from "~/components/DraggableCard";
import { useCallback, useEffect, useState } from "react";
import { produce } from "immer";
import type { CardItem } from "~/components/DraggableCard/DraggableCard";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { useGetExamQuestion } from "~/api/student";

/* 
    TODO: (bug) -> se arrastar um card dentro do slot para um outro slot, 
                   duplica o card
*/

type Slot = CardItem | null;

export function Model2({ question, answerCallback }: ModelProps) {
  const [slots, setSlots] = useState<Slot[]>(question.options.map(() => null));

  const [options, setOptions] = useState<CardItem[]>(
    question.options.map((option) => ({
      ...option,
      type: "ANSWER_CARD",
    }))
  );

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (slots.includes(null)) return;

    mutate({
      questionId: question.id,
      optionsAnswered: slots.map((slot, inx) => ({
        position: slot?.position ?? 0,
        positionAnswer: inx,
      })),
    });
  }

  const handleDrop = useCallback(function (
    item: CardItem | null,
    index: number
  ) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );
  },
    []);

  const { audioTitles } = useQuestionHelper(question);

  useEffect(() => {
    setSlots(question.options.map(() => null));
  }, [question]);

  useEffect(() => {
    setOptions(
      question.options.map((option) => ({
        ...option,
        type: "ANSWER_CARD",
      }))
    );
  }, [question]);

  return (
    <>
      <Group>
        {audioTitles.map((title) => (
          <AudioButton
            key={title.file_url}
            src={title.file_url ?? ""}
            autoPlay
          />
        ))}
      </Group>

      <Stack>
        <SimpleGrid cols={options.length} spacing={24}>
          {slots.map((slot, inx) => (
            <DragSlotCard
              key={inx}
              accept="ANSWER_CARD"
              onDrop={(item) => handleDrop(item, inx)}
              item={slot}
              onClear={() => handleDrop(null, inx)}
            />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={options.length} spacing={24}>
          {options
            .sort((a, b) => a.position - b.position)
            .map((item) => (
              <DraggableCard
                item={item}
                key={item.position}
                hidden={
                  !!slots.find((slot) => slot?.position === item.position)
                }
              />
            ))}
        </SimpleGrid>
      </Stack>

      <EduButton disabled={slots.includes(null)} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
