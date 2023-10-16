import { Box, Group, Image, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";

export function QME2x3Video({ question, onAnswerChange }: ModelProps) {
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

  useEffect(() => {
    setSelected([]);
  }, [question]);

  const { videoTitles, optionArrKey } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    onAnswerChange(selected);
  }, [selected]);

  return (
    <>
      <Group
        noWrap
        grow
        spacing={((lousaHeight * 0.5) / 100).toString() + "vh"}
        my="auto"
        pt={((lousaHeight * 0.5) / 100).toString() + "vh"}
      >
        <Box maw={(lousaWidth * 50) / 100}>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            autoPlay
          />
        </Box>

        <Box maw={(lousaWidth * 50) / 100}>
          <SimpleGrid cols={2} spacing={20}>
            {question.options.map((option, inx) => (
              <OptionButton
                key={optionArrKey(option, inx)}
                data-selected={
                  !!selected.find((item) => item.position === option.position)
                }
                onClick={() => selectItem(option)}
                isCorrect={option.isCorrect}
              >
                {option.image_url && (
                  <Image
                    src={option.image_url}
                    alt={option.description}
                    width="100%"
                  />
                )}
                {!option.image_url && option.description && (
                  <Text>{option.description}</Text>
                )}
              </OptionButton>
            ))}
          </SimpleGrid>
        </Box>
      </Group>
    </>
  );
}
