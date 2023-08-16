import { Loader, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useGetFirstExamQuestion } from "~/api/student";
import { useState } from "react";
import { Question } from "~/api/exam";
import { testQuestions } from "./__test-questions";

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
      alert("EXAM COMPLETED");
    } else {
      setCurrentQuestion(answer);
    }
  }

  // const _fakeQuestion = { } as unknown as Question;
  // const _fakeQuestion =
  //   testQuestions.MODEL18?.[0] ?? ({} as unknown as Question);

  return (
    <Stack
      align="center"
      justify="space-between"
      h="100%"
      style={{ position: "relative" }}
    >
      {isLoading && <Loader />}
      <Stack spacing={55} align="center" h="100%" w="100%" px={54}>
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
