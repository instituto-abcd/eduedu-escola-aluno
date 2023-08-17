import { Group, LoadingOverlay, SimpleGrid, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { DragSlotCard, DraggableCard } from "~/components/DraggableCard";
import { useCallback, useEffect, useState } from "react";
import { produce } from "immer";
import type { CardItem } from "~/components/DraggableCard/DraggableCard";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { EduButton } from "~/components/EduButton";
import { useGetExamQuestion } from "~/api/student";
import { VideoPlayer } from "~/components/VideoPlayer";

type Slot = CardItem | null;

export function Model2Video({ question, answerCallback }: ModelProps) {
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

  const { videoTitles } = useQuestionHelper(question);

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
      <Group my="auto">
        {videoTitles.map((title) => (
          <VideoPlayer
            src={title.file_url ?? ""}
            key={title.description}
            autoPlay
          />
        ))}

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
      </Group>

      <EduButton disabled={slots.includes(null)} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
