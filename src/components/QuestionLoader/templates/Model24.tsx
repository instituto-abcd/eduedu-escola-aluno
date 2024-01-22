import { Group, Image, Stack, Title } from "@mantine/core";
import { IconVolume } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";

export function Model24({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles, textTitles, imageTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<number>(-1);

  // Variação de completar o texto
  const varExeptions = ["Texto para completar, exp: a menina perdeu a ____"];
  const isTypeComplete = textTitles
    .filter((title) => !varExeptions.includes(title.placeholder))
    .some((title) => title.placeholder.includes("completar"));

  // Variação de selecionar alternativa
  const isTypeSelect = !isTypeComplete;
  const [singleAnswer, setSingleAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(-1);
    setSingleAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(isTypeSelect ? [singleAnswer as QuestionOption] : []);
  }, [answer, singleAnswer]);

  const conditions = useMemo(
    () => [isTypeSelect ? !!singleAnswer : answer !== -1],
    [answer, singleAnswer],
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const getDashesAccordingAnswer = useCallback(() => {
    const length = question.options.find((option) => option.isCorrect)
      ?.description?.length;
    return Array.prototype.join.call({ length: (length || -1) + 1 }, "_");
  }, [question]);

  const singleAnswerWithUnderlineDashes = useMemo(
    () =>
      singleAnswer?.description
        ? `<span style="text-decoration: underline;">${singleAnswer?.description}</span>`
        : getDashesAccordingAnswer(),
    [question, singleAnswer],
  );

  return (
    <>
      <AudioContainer question={question} audioTitles={audioTitles} hasPrimaryIcon={false} />

      <Stack my="auto" spacing={boardW(40)}>
        {isTypeComplete && (
          <Stack align="center" spacing={boardW(25)}>
            {textTitles.find((title) => title.placeholder.includes("completar"))
              ?.description && (
                <Title
                  dangerouslySetInnerHTML={{
                    __html:
                      textTitles.find((title) =>
                        title.placeholder.includes("completar"),
                      )?.description ?? "",
                  }}
                  size={boardW(24)}
                  weight={500}
                  color="dark.3"
                  align="center"
                />
              )}

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
                ),
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
                (title) => title.description && title.description.length > 0,
              )
              .map((title) => (
                <Title
                  dangerouslySetInnerHTML={{
                    __html: title.description.replace(
                      /_+/g,
                      singleAnswerWithUnderlineDashes ??
                      getDashesAccordingAnswer(),
                    ),
                  }}
                  key={title.description}
                  size={boardW(24)}
                  weight={500}
                  color="dark.3"
                  align="center"
                />
              ))}

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
                ),
            )}

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
                  {option.sound_url && !option.image_url && (
                    <IconVolume size={boardW(62)} />
                  )}
                </OptionButton>
              ))}
            </Group>
          </Stack>
        )}
      </Stack>
    </>
  );
}
