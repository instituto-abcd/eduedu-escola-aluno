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
import { useMediaTrackStore } from "~/stores/media-track.store";

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

  const mediaTrack = useMediaTrackStore();

  return (
    <>
      <Group my="auto">
        <VideoPlayer
          src={videoTitles[0]?.file_url ?? ""}
          onPlayStatusChange={mediaTrack.setPlayStatus}
          canPlay={mediaTrack.canPlay()}
          autoPlay
        />

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
            {options.map((item) => (
              <DraggableCard
                item={item}
                key={item.position}
                hidden={
                  !!slots.find((slot) => slot?.position === item.position) ||
                  mediaTrack.isPlaying
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
