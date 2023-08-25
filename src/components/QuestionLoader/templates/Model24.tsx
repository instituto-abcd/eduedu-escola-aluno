import { Group, Image, LoadingOverlay, Stack, Title } from "@mantine/core";

import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { IconRotateClockwise } from "@tabler/icons-react";
import { OptionButton } from "~/components/OptionButton";
import { EduButton } from "~/components/EduButton";
import { useEffect, useState } from "react";

// Determinar a variação de modelo
// Variação de completar a frase: filtrar titles do tipo TEXT que incluam "completar"
// Variação de selecionar alternativa do tipo texto: TODO
// Variação com ilustração e alternativas em imagem: TODO
// Variação de texto longo e alternativas: TODO

export function Model24({ question }: ModelProps) {
  const { audioTitles, textTitles, imageTitles, optionArrKey } =
    useQuestionHelper(question);

  const [answer, setAnswer] = useState<number>(-1);

  const isTypeComplete = textTitles.some((title) =>
    title.placeholder.includes("completar")
  );

  const isLoading = false;

  useEffect(() => {
    setAnswer(-1);
  }, [question]);

  return (
    <>
      <Group>
        {audioTitles.map((title, inx) =>
          inx === 0 ? (
            <AudioButton key={title.position} src={title.file_url ?? ""} />
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
              src={title.file_name}
              width="auto"
              height={230}
              alt={title.placeholder}
              key={title.file_url}
            />
          )
      )}

      {isTypeComplete && (
        <Stack my="auto" align="center" spacing={100}>
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
      <EduButton disabled={answer === -1}>Continuar</EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
