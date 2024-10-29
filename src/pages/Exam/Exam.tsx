import { Loader, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useGetFirstExamQuestion } from "~/api/student";
import { useState } from "react";
import { Question } from "~/api/exam";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/constants/path";
import { useExamProgress } from "~/stores/exam-progress";
import { lousaWidth } from "~/constants/dimensions";
import { StagingQuestionInfo } from "../Debug/components/StagingQuestionInfo";
import { AudioInterface } from "~/sounds";

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
      },
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
      {/* 
          <Progress
            value={currentQuestion?.progress ?? 0}
            style={{ position: "fixed", top: 100, zIndex: 999, display: "none" }}
          />

        TODO: definir se o progress vai continuar no layout
      */}
      <Stack
        spacing={lousaWidth * 0.045}
        align="center"
        h="100%"
        w="100%"
        style={{ position: "relative" }}
      >
        {isLoading && <Loader />}
        {currentQuestion && (
          <QuestionLoader
            question={currentQuestion}
            answerCallback={handleAnswer}
          />
        )}
      </Stack>

      {currentQuestion && showStagingInfo && (
        <Stack style={{ position: "fixed", bottom: 70, left: 30, zIndex: 999 }}>
          <StagingQuestionInfo question={currentQuestion} />
        </Stack>
      )}
    </>
  );
}
