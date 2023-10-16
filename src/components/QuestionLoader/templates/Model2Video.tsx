import { Box, Group, SimpleGrid, Stack } from "@mantine/core";
import { produce } from "immer";
import { useCallback, useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { VideoPlayer } from "~/components/VideoPlayer";
import { lousaPaddingTop, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";

export function Model2Video({ question, onAnswerChange }: ModelProps) {
  const [slots, setSlots] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

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

  useEffect(() => {
    onAnswerChange(
      slots.filter((answer) => answer !== null) as QuestionOption[]
    );
  }, [slots]);

  return (
    <>
      <Group noWrap grow my="auto" pt={lousaPaddingTop}>
        <Box
          w={(lousaWidth * 38) / 100}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            autoPlay
          />
        </Box>

        <Stack
          maw={(lousaWidth * 62) / 100}
          style={{
            padding: "1vw",
          }}
        >
          <SimpleGrid
            cols={question.options.length}
            style={{ placeItems: "center" }}
            spacing={20}
          >
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

          <SimpleGrid
            cols={question.options.length}
            style={{ placeItems: "center" }}
            spacing={20}
          >
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
    </>
  );
}
