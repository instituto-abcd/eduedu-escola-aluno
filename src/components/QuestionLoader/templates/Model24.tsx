import {
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Title,
} from "@mantine/core";

import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { IconRotateClockwise } from "@tabler/icons-react";
import { OptionButton } from "~/components/OptionButton";
import { EduButton } from "~/components/EduButton";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight, boardW } from "~/constants/dimensions";

export function Model24({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles, imageTitles, optionArrKey } =
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

  const disabled = isTypeSelect ? !singleAnswer : answer === -1;

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (isTypeSelect && !singleAnswer) return;
    if (isTypeComplete && answer === -1) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: isTypeSelect ? [singleAnswer as QuestionOption] : [],
    });
  }

  useEffect(() => {
    setAnswer(-1);
    setSingleAnswer(null);
  }, [question]);

  return (
    <>
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles
          .filter((title) => title.file_url)
          .map((title, inx) =>
            inx === 0 ? (
              <AudioButton
                key={title.position}
                src={title.file_url ?? ""}
                autoPlay
              />
            ) : (
              <AudioButton
                key={title.position}
                src={title.file_url ?? ""}
                buttonProps={{
                  icon: (
                    <IconRotateClockwise
                      style={{ transform: "rotateX(180deg)" }}
                      size={30}
                    />
                  ),
                }}
              />
            )
          )}
      </Group>

      {/* Board content */}
      <Stack my="auto">
        {imageTitles.map(
          (title) =>
            title.file_url && (
              <Image
                mx="auto"
                src={title.file_url}
                width="auto"
                height={boardW(170)}
                alt={title.placeholder}
                key={title.file_url}
              />
            )
        )}

        {isTypeComplete && (
          <Stack align="center" spacing={boardW(25)}>
            {textTitles.find((title) =>
              title.placeholder.includes("completar")
            )?.description && (
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
                  key={optionArrKey(option, inx)}
                  isCorrect={option.isCorrect}
                  onClick={() => setAnswer(inx)}
                  data-selected={answer === inx}
                  style={{
                    width: boardW(120),
                    height: boardW(120),
                  }}
                >
                  {option.description}
                  {option.image_url && (
                    <Image src={option.image_url} maw={boardW(100)} mah={boardW(100)} />
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
                (title) => title.description && title.description.length > 5
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
            <Group mb={20}>
              {question.options.map((option, inx) => (
                <OptionButton
                  key={optionArrKey(option, inx)}
                  isCorrect={option.isCorrect}
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
                        height: boardW(100)
                      }}
                    />
                  )}
                </OptionButton>
              ))}
            </Group>
          </Stack>
        )}
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={disabled}
        onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
