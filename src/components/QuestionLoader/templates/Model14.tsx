import { Group, Image, LoadingOverlay } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton/EduButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { TextOptionButton } from "~/components/OptionButton";
import { useState } from "react";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight } from "~/constants/dimensions";

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
      {audioTitles
        .filter((title) => title.file_url)
        .map((title) => (
          <AudioButton src={title.file_url!} key={title.file_url} autoPlay />
        ))}

      <Group my="auto" position="apart" noWrap>
        {question.options.map(
          (option) =>
            option.image_url && (
              <Image src={option.image_url} key={option.image_url} />
            )
        )}

        <Group noWrap>
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
              >
                {inx + 1}
              </TextOptionButton>
            ))}
        </Group>
      </Group>

      <EduButton disabled={answer === null} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
