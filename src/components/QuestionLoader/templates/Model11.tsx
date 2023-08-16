import {
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DraggableLetters } from "~/components/DraggableLetters/DraggableLetters";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { QuestionOption } from "~/api/exam";
import { Fragment, useState } from "react";
import { useGetExamQuestion } from "~/api/student";

/*
 *   TODO: implementar "audio alternativo" (botao amarelo) removido temporariamente
 */

export function Model11({ question, answerCallback }: ModelProps) {
  const { imageTitles, audioTitles, textTitles } = useQuestionHelper(question);

  const [, word] = question.description.split("/");
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [{ position: answer.position, positionAnswer: 0 }],
    });
  }
  return (
    <>
      <Group>
        {audioTitles.map((title) => (
          <AudioButton
            src={title.file_url ?? ""}
            autoPlay
            key={title.file_url}
          />
        ))}
      </Group>

      <Group position="apart" spacing={137} my="auto" noWrap>
        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.file_name}
            width={362}
            key={title.file_url}
            mx="auto"
          />
        ))}

        <Stack align="center" spacing={40}>
          {textTitles.map((title) => (
            <Title color="dark.3" size={30} key={title.description}>
              {title.description.split("/")[0]}
            </Title>
          ))}

          <Group>
            {word &&
              word.split("_").map((w, inx, arr) => (
                <Fragment key={w}>
                  <Text color="dark.3" size={50} weight={700}>
                    {w}
                  </Text>
                  {arr.length !== inx + 1 && (
                    <DragLetterSlot
                      onDrop={(item) => setAnswer(item)}
                      option={answer}
                      onClear={() => setAnswer(null)}
                    />
                  )}
                </Fragment>
              ))}
          </Group>

          <Group>
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((option) =>
                question.axis_code === "LC" ? (
                  /* Vamos assumir que o eixo LC (leitura e compreensao de texto)
                   *  contempla alternativas em texto longo,
                   *  já as demais apenas 1 palavra ou poucas letas
                   */
                  <TextOptionButton key={option.position}>
                    {option.description}
                  </TextOptionButton>
                ) : (
                  <DraggableLetters key={option.position} option={option}>
                    {option.description}
                  </DraggableLetters>
                )
              )}
          </Group>
        </Stack>
      </Group>

      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{ marginTop: "auto" }}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
