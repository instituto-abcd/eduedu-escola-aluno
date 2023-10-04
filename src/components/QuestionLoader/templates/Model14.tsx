// Aux & Utils:
import { useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { ModelProps } from ".";

// Components:
import { TextOptionButton } from "~/components/OptionButton";
import { Box, Group, Image, LoadingOverlay, Stack } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model14({ question, answerCallback }: ModelProps) {
  const { audioTitles } = useQuestionHelper(question);
  const circleRule = question.rules.find((rule) => rule.name === "circle_size");
  const circleSize = circleRule ? +circleRule.value : 4;
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (answer === null) return;

    mutate({
      optionsAnswered: [answer],
      planetId: question.planet_id,
      questionId: question.id,
    });
  }

  return (
    <>
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles
          .filter((title) => title.file_url)
          .map((title) => (
            <AudioButton src={title.file_url!} key={title.file_url} autoPlay />
          ))}
      </Group>

      {/* Board content */}
      <Group
        w="100%"
        h="100%"
        mx="auto"
        spacing={(lousaWidth * 5 / 100)}
      >
        <Box
          maw={lousaWidth * 40 / 100}
          w="100%"
          display="flex"
        >
          {question.options.map(
            (option) =>
              option.image_url && (
                <img
                  style={{
                    margin: 'auto',
                    height: `${lousaHeight * 40 / 100}px`,
                  }}
                  src={option.image_url}
                  key={option.image_url}
                />
              )
          )}
        </Box>
        <Box maw={lousaWidth * 40 / 100} w="100%">
          <Stack m="auto">
            {Array(circleSize)
              .fill(null)
              .map((_, inx) => (
                <TextOptionButton
                  onClick={() =>
                    setAnswer({
                      position: inx,
                      positionAnswer: inx,
                    } as QuestionOption)
                  }
                  key={inx}
                  data-selected={answer?.position === inx}
                  style={{
                    width: '100%'
                  }}
                >
                  {inx + 1}
                </TextOptionButton>
              ))}
          </Stack>
        </Box>
      </Group >

      {/* Continue to the next screen button */}
      < EduButton
        disabled={answer === null}
        onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}
      >
        Continuar
      </EduButton >

      {/* Loading animation */}
      < LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
