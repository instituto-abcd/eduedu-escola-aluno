import { Group, LoadingOverlay, SimpleGrid, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { useCallback, useEffect, useState } from "react";
import { produce } from "immer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { EduButton } from "~/components/EduButton";
import { useGetExamQuestion } from "~/api/student";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { QuestionOption } from "~/api/exam";

export function Model2Video({ question, answerCallback }: ModelProps) {
  const [slots, setSlots] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (slots.includes(null)) return;

    mutate({
      questionId: question.id,
      optionsAnswered: slots as QuestionOption[],
    });
  }

  const handleDrop = useCallback(function (
    item: QuestionOption | null,
    index: number
  ) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item ? { ...item, positionAnswer: index } : item;
      })
    );
  },
  []);

  const { videoTitles } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setSlots(question.options.map(() => null));
  }, [question]);

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
          <SimpleGrid cols={question.options.length} spacing={24}>
            {slots.map((slot, inx) => (
              <DraggableCardSlot
                key={inx}
                accept="ANSWER_CARD"
                onDrop={(item) => handleDrop(item, inx)}
                item={slot}
                replaceWith={
                  <DraggableCard
                    item={slot}
                    image={slot?.image_url}
                    text={slot?.description}
                    sound={slot?.sound_url}
                    disabled
                    onClear={() => handleDrop(null, inx)}
                  />
                }
              />
            ))}
          </SimpleGrid>

          <SimpleGrid cols={question.options.length} spacing={24}>
            {question.options.map((item, inx) => (
              <DraggableCard
                item={item}
                image={item.image_url}
                text={item.description}
                sound={item.sound_url}
                key={inx}
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
