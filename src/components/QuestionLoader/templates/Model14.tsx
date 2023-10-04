import { Group, LoadingOverlay, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model14({ question, answerCallback }: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);
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

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url!}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </Group>
      )}

      <Group w="100%" my="auto" position="center" spacing={boardW(120)}>
        {question.options.map(
          (option) =>
            option.image_url && (
              <img
                width={boardW(280)}
                style={{ maxHeight: boardW(280) }}
                src={option.image_url}
                key={option.image_url}
              />
            )
        )}

        <Stack w="45%">
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
                  width: "100%",
                }}
              >
                {inx + 1}
              </TextOptionButton>
            ))}
        </Stack>
      </Group>

      <EduButton disabled={answer === null} onClick={submitAnswer}>
        Continuar
      </EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
