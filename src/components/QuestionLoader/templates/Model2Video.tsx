// Aux & Utils:
import { ModelProps } from ".";
import { useCallback, useEffect, useState } from "react";
import { produce } from "immer";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useGetExamQuestion } from "~/api/student";
import { QuestionOption } from "~/api/exam";
import { lousaHeight, lousaWidth, lousaPaddingTop } from "~/constants/dimensions";

// Components:
import { Box, Group, LoadingOverlay, SimpleGrid, Stack } from "@mantine/core";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton";
import { VideoPlayer } from "~/components/VideoPlayer";

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
      {/* Board content */}
      <Group
        noWrap
        grow
        my="auto"
        pt={lousaPaddingTop}
      >
        <Box maw={lousaWidth * 50 / 100} style={{ display: 'flex', justifyContent: 'center' }}>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            autoPlay
            customHeight={(lousaWidth * 30 / 100).toString()}
          />
        </Box>

        <Stack maw={lousaWidth * 50 / 100}>
          <SimpleGrid cols={question.options.length} style={{ placeItems: "center" }} spacing={20}>
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

          <SimpleGrid cols={question.options.length} style={{ placeItems: "center" }} spacing={20}>
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

      {/* Continue to the next screen button */}
      <EduButton
        disabled={slots.includes(null)}
        onClick={submitAnswer}
        style={{
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
