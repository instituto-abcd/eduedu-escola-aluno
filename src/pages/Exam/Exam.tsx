import { Loader, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useGetFirstExamQuestion } from "~/api/student";
import { useState } from "react";
import { Question } from "~/api/exam";

export function ExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const { isLoading } = useGetFirstExamQuestion({
    onSuccess: (question) => {
      if (!currentQuestion) {
        setCurrentQuestion(question);
      }
    },
  });

  function handleAnswer(
    answer:
      | Question
      | {
          examCompleted: true;
        }
  ) {
    if ("examCompleted" in answer) {
      console.log("EXAM COMPLETED");
    } else {
      setCurrentQuestion(answer);
    }
  }

  return (
    <Stack
      align="center"
      justify="space-between"
      h="100%"
      style={{ position: "relative" }}
    >
      {isLoading && <Loader />}
      <Stack spacing={65} align="center" h="100%" w="100%" px={54}>
        {currentQuestion && (
          <QuestionLoader
            question={currentQuestion}
            answerCallback={handleAnswer}
          />
        )}
      </Stack>
    </Stack>
  );
}
