// Aux & Utils:
import { useEffect, useState } from "react";
import { Answer, useGetExamQuestion } from "~/api/student";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { boardW, lousaHeight, lousaPaddingTop, lousaWidth, scrollAreaHeight, scrollAreaWidth } from "~/constants/dimensions";
import { ModelProps } from ".";

// Components:
import { Box, Group, LoadingOverlay, ScrollArea, SimpleGrid } from "@mantine/core";
import { VideoPlayer } from "~/components/VideoPlayer";
import { OptionButton } from "~/components/OptionButton";
import { EduButton } from "~/components/EduButton";

export function QMES5({ question, answerCallback }: ModelProps) {
  const [selected, setSelected] = useState<Answer[]>([]);
  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function selectItem(answer: Answer) {
    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          position: answer.position,
          positionAnswer: answer.position,
        },
      ]);
    }
  }

  function submitAnswer() {
    if (selected.length === 0) return;

    mutate({
      questionId: question.id,
      optionsAnswered: selected,
    });
  }

  const { videoTitles, optionArrKey } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setSelected([]);
  }, [question]);

  return (
    <>
      {/* Board content */}
      <Group w="100%" m="auto" gap={boardW(10)}>
        <Box h="100%" w="100%" maw={boardW(440)} style={{ display: "flex", justifyContent: "center" }}>
          <Box m="auto">
            <VideoPlayer
              src={videoTitles[0]?.file_url ?? ""}
              onPlayStatusChange={mediaTrack.setPlayStatus}
              canPlay={mediaTrack.canPlay()}
              autoPlay
              customHeight={(lousaWidth * 35 / 100).toString()}
            />
          </Box>
        </Box>

        <ScrollArea mah={boardW(510)}>
          <SimpleGrid
            cols={2}
            spacing={20}
            style={{ marginBottom: "5px" }}
          >
            {question.options.map((option, inx) => (
              <OptionButton
                key={optionArrKey(option, inx)}
                onClick={() =>
                  selectItem({
                    position: option.position,
                    positionAnswer: option.position,
                  })
                }
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

      {/* Continue to the next screen button */}
      <EduButton
        disabled={selected.length === 0}
        onClick={submitAnswer}
        style={{
          marginTop: "auto"
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
