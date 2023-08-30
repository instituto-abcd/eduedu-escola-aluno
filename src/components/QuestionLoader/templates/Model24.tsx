import { Group, Image, LoadingOverlay, Stack, Title } from "@mantine/core";

import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { IconRotateClockwise } from "@tabler/icons-react";
import { OptionButton } from "~/components/OptionButton";
import { EduButton } from "~/components/EduButton";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";

// Determinar a variação de modelo
// Variação de completar a frase: filtrar titles do tipo TEXT que incluam "completar"
// Variação de selecionar alternativa do tipo texto: TODO
// Variação com ilustração e alternativas em imagem: TODO
// Variação de texto longo e alternativas: TODO

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
  }, [question]);

  return (
    <>
      <Group>
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

      {imageTitles.map(
        (title) =>
          title.file_url && (
            <Image
              src={title.file_url}
              width="auto"
              height={230}
              alt={title.placeholder}
              key={title.file_url}
            />
          )
      )}

      {isTypeComplete && (
        <Stack my="auto" align="center" spacing={100}>
          {textTitles.find((title) => title.placeholder.includes("completar"))
            ?.description && (
            <Title
              dangerouslySetInnerHTML={{
                __html:
                  textTitles.find((title) =>
                    title.placeholder.includes("completar")
                  )?.description ?? "",
              }}
              color="dark.3"
              weight={500}
            ></Title>
          )}
          <Group>
            {question.options.map((option, inx) => (
              <OptionButton
                key={optionArrKey(option, inx)}
                isCorrect={option.isCorrect}
                onClick={() => setAnswer(inx)}
                data-selected={answer === inx}
              >
                {option.description}
                {option.image_url && (
                  <Image src={option.image_url} maw="80%" mah="80%" />
                )}
              </OptionButton>
            ))}
          </Group>
        </Stack>
      )}

      {isTypeSelect && (
        <Stack my="auto" align="center" spacing={100}>
          {textTitles
            .filter(
              (title) => title.description && title.description.length > 5
            )
            .map((title) => (
              <Title
                dangerouslySetInnerHTML={{ __html: title.description }}
                color="dark.3"
                weight={500}
              ></Title>
            ))}
          <Group>
            {question.options.map((option, inx) => (
              <OptionButton
                key={optionArrKey(option, inx)}
                isCorrect={option.isCorrect}
                onClick={() => setSingleAnswer(option)}
                data-selected={
                  JSON.stringify(singleAnswer) === JSON.stringify(option)
                }
              >
                {option.description}
                {option.image_url && (
                  <Image src={option.image_url} maw="80%" mah="80%" />
                )}
              </OptionButton>
            ))}
          </Group>
        </Stack>
      )}
      <EduButton
        disabled={disabled}
        style={{ marginTop: isTypeSelect ? "auto" : "none" }}
        onClick={submitAnswer}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
