import { Group, Stack } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useCreateSound } from "~/hooks/useCreateSound";

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

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const { sound } = useCreateSound({
    src: question.options[0]?.sound_url ?? "",
    autoPlay: false,
  });

  const handleOnClick = (index: number) => {
    sound.play();
    setAnswer({
      position: index,
      positionAnswer: index,
    } as QuestionOption);
  }

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
                onClick={() => handleOnClick(inx)}
                key={inx}
                data-selected={
                  typeof answer?.position === "number"
                    ? +answer.position >= inx
                    : false
                }
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
