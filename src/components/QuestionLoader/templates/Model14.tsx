import { Group, Stack } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { IconMessageCircle2 } from "@tabler/icons-react";

export function Model14({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitleAutoplay } = useQuestionHelper(question);
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

  const hasAux = !!question.options[0]?.sound_url;
  const auxAudioRef = useRef<AudioButtonRef>(null);

  const mainAudioRef = useRef<AudioButtonRef>(null);
  useEffect(() => {
    if (auxAudioRef.current) {
      mainAudioRef.current?.sound.onEnd(() => {
        const auxSound = auxAudioRef.current?.sound;
        if (hasAux && auxSound && !auxSound.playing()) {
          auxSound.play();
        }
      });
    }
  }, [mainAudioRef, auxAudioRef]);

  const handleOnClick = (index: number) => {
    setAnswer({
      position: index,
      positionAnswer: index,
    } as QuestionOption);
  };

  const audioTitles = question.titles.filter((title) => title.type === "AUDIO")
    .filter((title) => title.file_id)
    .sort((a, b) => a.position - b.position);

  const hasAudioTitle = useMemo(() => audioTitles.some((title) => title.file_id), [audioTitles]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto">
          {audioTitles.map((title, inx) => (
            <AudioButton
              ref={mainAudioRef}
              src={title.file_url!}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
          {hasAux && (
            <AudioButton
              ref={auxAudioRef}
              src={question.options[0].sound_url!}
              variant="yellow"
              autoPlay={!!mainAudioRef}
              icon={<IconMessageCircle2 size={30} />}
            />
          )}
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
                  width: boardW(100),
                  height: boardW(100),
                  borderRadius: "50%",
                  alignSelf: "center",
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
