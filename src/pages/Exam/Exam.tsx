import { Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useGetFirstExamQuestion } from "~/api/student";
import { useState } from "react";
import { Question } from "~/api/exam";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/constants/path";
import { useExamProgress } from "~/stores/exam-progress";
import { StagingQuestionInfo } from "../Debug/components/StagingQuestionInfo";
import { AudioInterface } from "~/sounds";
import { ScreenInfo } from "../Debug/components/ScreenInfo";

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
          examCompleted?: true;
        }
  ) {
    if ("examCompleted" in answer) {
      navigate(PATH.EXAM_EVALUATION);
    } else {
      setCurrentQuestion(answer as Question);
      (answer as Question).progress &&
        updateProgress((answer as Question).progress!);

      /* Handle Feedback Sound */
      AudioInterface.feedback.positive.play();
    }
  }

  // const showStagingInfo = !import.meta.env.PROD;
  const showStagingInfo = false; // TODO: workaround

  return (
    <>
      {currentQuestion && (
        <QuestionLoader
          question={currentQuestion}
          answerCallback={handleAnswer}
        />
      )}

      {currentQuestion && showStagingInfo && (
        <Stack style={{ position: "fixed", bottom: 70, left: 30, zIndex: 999 }}>
          <StagingQuestionInfo question={currentQuestion} />
        </Stack>
      )}

      <div className="fixed bottom-4 left-6">
        <ScreenInfo />
      </div>
    </>
  );
}
