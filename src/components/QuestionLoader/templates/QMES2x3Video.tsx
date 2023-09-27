import { Box, Group, Image, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { Answer, useGetExamQuestion } from "~/api/student";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";

export function QME2x3Video({ question, answerCallback }: ModelProps) {
  const [selected, setSelected] = useState<Answer[]>([]);
  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function selectItem(_answer: QuestionOption) {
    const answer = {
      position: _answer.position,
      positionAnswer: _answer.position,
    };

    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          position: _answer.position,
          positionAnswer: _answer.position,
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

  useEffect(() => {
    setSelected([]);
  }, [question]);

  const { videoTitles, optionArrKey } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  return (
    <>
      {/* Board content */}
      <Group
        noWrap
        grow
        spacing={(lousaHeight * 0.5 / 100).toString() + 'vh'}
        my="auto"
        pt={(lousaHeight * 0.5 / 100).toString() + 'vh'}
      >
        <Box maw={lousaWidth * 50 / 100}>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            customHeight={(lousaWidth * 35 / 100).toString()}
            autoPlay
          />
        </Box>

        <Box maw={lousaWidth * 50 / 100}>
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

      {/* Continue to the next screen button */}
      <EduButton
        disabled={selected.length === 0}
        onClick={submitAnswer}
        style={{
          marginTop: "auto",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
