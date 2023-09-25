import { Loader, Progress, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useGetFirstExamQuestion } from "~/api/student";
import { useState } from "react";
import { Question } from "~/api/exam";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/constants/path";
import { useExamProgress } from "~/stores/exam-progress";
import { testQuestions } from "./__test-questions";

export function ExamPage() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const updateProgress = useExamProgress((state) => state.setValue);

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
      navigate(PATH.EXAM_EVALUATION);
    } else {
      setCurrentQuestion(answer);
      answer.progress && updateProgress(answer.progress);
    }
  }

  const fakeQuestion = testQuestions.MODEL32?.[0] ?? {};

  return (
    <>
      <Progress
        value={currentQuestion?.progress ?? 0}
        style={{ position: "fixed", top: 100, zIndex: 999 }}
      />
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
    </>
  );
}
