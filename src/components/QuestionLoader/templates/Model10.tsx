import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { boardW } from "~/constants/dimensions";
import { Group, ScrollArea, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { AudioButton } from "~/components/AudioButton";
import { IconMessageCircle2, IconVolume } from "@tabler/icons-react";
import { ReadButton } from "~/components/ReadButton";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";

export function Model10({
  question,
  auxQuestion,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const {
    imageTitles,
    textTitles,
    audioTitles,
    hasAudioTitle,
    getRule,
  } = useQuestionHelper(question);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const hideTextRule = getRule("options_hide_text")?.value === "true" ?? false;

  const autoplayRule = getRule("autoplay");
  const autoplayAuxRule = getRule("autoplayAux");
  const shouldPlay = autoplayRule?.value === "false" ? false : true;
  const shouldPlayAuxiliar = autoplayAuxRule?.value === "false" ? false : true;

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxAudioRef = useRef<AudioButtonRef>(null);

  useLayoutEffect(() => {
    if (mainAudioRef.current && auxAudioRef.current) {
      if (shouldPlay) {
        mainAudioRef.current.sound.onEnd(() => {
          auxAudioRef.current!.sound.play();
        });
      }
    }

    return () => {
      auxAudioRef.current?.sound.destroy();
    };
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => {
            const shouldPlayCheck = inx === 0 ? shouldPlay : shouldPlay === false;
            const props = {
              ref: inx === 0 ? mainAudioRef : auxAudioRef,
              autoPlay: shouldPlayCheck ? shouldPlayAuxiliar ? true : false : false,
              icon: inx > 0 ? (
                <IconMessageCircle2 size={30} />
              ) : undefined,
              variant: inx > 0 ? "yellow" : "gray",
            } as const;

            return ( <AudioButton key={inx} src={title.file_url ?? ""} {...props}/> );
          })}

          {auxQuestion && <ReadButton question={auxQuestion} />}
        </Group>
      )}

      {textTitles
        .filter(
          (title) => title.description && !title.placeholder.includes("ID")
        )
        .map((title, inx) => (
          <ScrollArea mah={boardW(100)} type="auto" key={inx} px="xs">
            <Title
              color="dark.3"
              size={boardW(22)}
              align="center"
              dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
              px={boardW(10)}
            />
          </ScrollArea>
        ))}

      <Group spacing={20} my="auto">
        {imageTitles
          .filter((title) => title.file_url)
          .map((title) => (
            <img
              src={title.file_url!}
              alt={title.description}
              width={boardW(350)}
              style={{ maxHeight: boardW(400), objectFit: "contain" }}
              key={title.file_url}
            />
          ))}

        <SimpleGrid cols={2}>
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              onClick={() =>
                setAnswer({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? +option.position
                    : undefined,
                })
              }
              data-selected={
                JSON.stringify(answer) ===
                JSON.stringify({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? option.position
                    : undefined,
                })
              }
              option={option}
            >
              {(!option.image_url || !hideTextRule) && (
                <>{option.description}</>
              )}

              {option.image_url && (
                <img
                  src={option.image_url}
                  alt={option.description}
                  width={boardW(100)}
                  style={{
                    maxHeight: boardW(110),
                    objectFit: "contain",
                    marginInline: "auto",
                  }}
                />
              )}
              {!option.image_url && option.sound_url && !option.description && (
                <IconVolume size={boardW(80)} />
              )}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>
    </>
  );
}
