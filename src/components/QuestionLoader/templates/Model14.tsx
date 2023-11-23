import { Group, Stack } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model14({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);
  const circleRule = question.rules.find((rule) => rule.name === "circle_size");
  const circleSize = circleRule ? +circleRule.value : 4;
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  const conditions = useMemo(() => [!answer], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

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
                debug={{ skipDebug: true }}
              >
                {inx + 1}
              </TextOptionButton>
            ))}
        </Stack>
      </Group>
    </>
  );
}
