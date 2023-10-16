import { Box, Group, ScrollArea, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";

export function QMES5({ question, onAnswerChange }: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);

  function selectItem(answer: QuestionOption) {
    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          ...answer,
          positionAnswer: answer.position,
        },
      ]);
    }
  }

  const { videoTitles, optionArrKey } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setSelected([]);
  }, [question]);

  useEffect(() => {
    onAnswerChange(selected);
  }, [selected]);

  return (
    <>
      <Group w="100%" m="auto">
        <Box
          h="100%"
          w="100%"
          maw={boardW(440)}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Box m="auto">
            <VideoPlayer
              src={videoTitles[0]?.file_url ?? ""}
              onPlayStatusChange={mediaTrack.setPlayStatus}
              canPlay={mediaTrack.canPlay()}
              autoPlay
            />
          </Box>
        </Box>

        <ScrollArea mah={boardW(510)}>
          <SimpleGrid cols={2} spacing={20} style={{ marginBottom: "5px" }}>
            {question.options.map((option, inx) => (
              <OptionButton
                key={optionArrKey(option, inx)}
                onClick={() => selectItem(option)}
                data-selected={
                  !!selected.find((item) => item.position === option.position)
                }
                isCorrect={option.isCorrect}
              >
                {option.description}
              </OptionButton>
            ))}
          </SimpleGrid>
        </ScrollArea>
      </Group>
    </>
  );
}
