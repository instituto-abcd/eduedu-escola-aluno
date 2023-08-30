import { LoadingOverlay, SimpleGrid, Title } from "@mantine/core";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useGetExamQuestion } from "~/api/student";
import { useState } from "react";
import { QuestionOption } from "~/api/exam";

export function Model5({ question, answerCallback }: ModelProps) {
  const { audioTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

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
        <AudioButton src={title.file_url ?? ""} key={title.file_url} autoPlay />
      ))}

      <Title color="dark.3" size={30} align="center" my="auto" maw={900}>
        {question.description}
      </Title>

      <SimpleGrid cols={2} w="full" my="auto">
        {question.options.map((option) => (
          <TextOptionButton
            key={option.position}
            onClick={() => setAnswer(option)}
            data-selected={JSON.stringify(answer) === JSON.stringify(option)}
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
