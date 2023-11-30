import { Group, Image, Stack, Title } from "@mantine/core";
import { IconRotateClockwise, IconVolume } from "@tabler/icons-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";

export function Model24({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles, textTitles, imageTitles, getRule } =
    useQuestionHelper(question);

  const [answer, setAnswer] = useState<number>(-1);

  // Variação de completar o texto
  const varExeptions = ["Texto para completar, exp: a menina perdeu a ____"];
  const isTypeComplete = textTitles
    .filter((title) => !varExeptions.includes(title.placeholder))
    .some((title) => title.placeholder.includes("completar"));

  // Variação de selecionar alternativa
  const isTypeSelect = !isTypeComplete;
  const [singleAnswer, setSingleAnswer] = useState<QuestionOption | null>(null);

  /* Autoplay logic */
  const autoplayRule = getRule("autoplay");
  const shouldPlay = autoplayRule?.value === "false" ? false : true;

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
  /* End autoplay logic */

  useEffect(() => {
    setAnswer(-1);
    setSingleAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(isTypeSelect ? [singleAnswer as QuestionOption] : []);
  }, [answer, singleAnswer]);

  const conditions = useMemo(
    () => [isTypeSelect ? !!singleAnswer : answer !== -1],
    [answer, singleAnswer]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      <Group mx="auto" h="50px">
        {audioTitles.map((title, inx) => {
          const props = {
            ref: inx === 0 ? mainAudioRef : auxAudioRef,
            autoPlay:
              inx === 0 ? shouldPlay : shouldPlay === false ? true : false,
            icon:
              inx > 0 ? (
                <IconRotateClockwise
                  style={{ transform: "rotateX(180deg)" }}
                  size={30}
                />
              ) : undefined,
          } as const;

          return (
            <AudioButton key={inx} src={title.file_url ?? ""} {...props} />
          );
        })}
      </Group>

      <Stack my="auto" spacing={boardW(40)}>
        {imageTitles.map(
          (title) =>
            title.file_url && (
              <Image
                key={title.file_url}
                src={title.file_url}
                alt={title.placeholder}
                styles={{ image: { marginInline: "auto" } }}
                width="auto"
                height={boardW(170)}
              />
            )
        )}

        {isTypeComplete && (
          <Stack align="center" spacing={boardW(25)}>
            {textTitles.find((title) => title.placeholder.includes("completar"))
              ?.description && (
              <Title
                dangerouslySetInnerHTML={{
                  __html:
                    textTitles.find((title) =>
                      title.placeholder.includes("completar")
                    )?.description ?? "",
                }}
                size={boardW(24)}
                weight={500}
                color="dark.3"
              />
            )}
            <Group mb={20}>
              {question.options.map((option, inx) => (
                <OptionButton
                  key={inx}
                  option={option}
                  onClick={() => setAnswer(inx)}
                  data-selected={answer === inx}
                  style={{
                    width: boardW(120),
                    height: boardW(120),
                  }}
                >
                  {option.description}
                  {option.image_url && (
                    <Image
                      m="auto"
                      src={option.image_url}
                      maw={boardW(100)}
                      mah={boardW(100)}
                    />
                  )}
                </OptionButton>
              ))}
            </Group>
          </Stack>
        )}

        {isTypeSelect && (
          <Stack align="center" spacing={boardW(25)}>
            {textTitles
              .filter(
                (title) => title.description && title.description.length > 0
              )
              .map((title) => (
                <Title
                  dangerouslySetInnerHTML={{
                    __html: title.description.replace(
                      /_+/g,
                      singleAnswer?.description ?? "_____"
                    ),
                  }}
                  key={title.description}
                  size={boardW(24)}
                  weight={500}
                  color="dark.3"
                />
              ))}
            <Group>
              {question.options.map((option, inx) => (
                <OptionButton
                  key={inx}
                  option={option}
                  onClick={() => setSingleAnswer(option)}
                  data-selected={
                    JSON.stringify(singleAnswer) === JSON.stringify(option)
                  }
                  style={{
                    width: boardW(190),
                    height: boardW(120),
                  }}
                >
                  {option.description}
                  {option.image_url && (
                    <img
                      src={option.image_url}
                      style={{
                        height: boardW(100),
                      }}
                    />
                  )}
                  {option.sound_url && <IconVolume size={boardW(62)} />}
                </OptionButton>
              ))}
            </Group>
          </Stack>
        )}
      </Stack>
    </>
  );
}
