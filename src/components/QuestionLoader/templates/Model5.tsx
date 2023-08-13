import { LoadingOverlay, SimpleGrid, Title } from "@mantine/core";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { Answer, useGetExamQuestion } from "~/api/student";
import { useState } from "react";

export function Model5({ question, answerCallback }: ModelProps) {
  const { audioTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<Answer | null>(null);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [answer],
    });
  }
  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton src={title.file_url} key={title.file_url} autoPlay />
      ))}

      <Title color="dark.3" size={30} align="center" my="auto" maw={900}>
        {question.description}
      </Title>

      <SimpleGrid cols={2} w="full" my="auto">
        {question.options
          .sort((a, b) => a.position - b.position)
          .map((option) => (
            <TextOptionButton
              key={option.position}
              onClick={() =>
                setAnswer({
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
              data-selected={answer?.position === option.position}
            >
              {option.description}
            </TextOptionButton>
          ))}
      </SimpleGrid>

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
