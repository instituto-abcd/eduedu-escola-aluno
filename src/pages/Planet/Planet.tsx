import { Stack } from "@mantine/core";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Question } from "~/api/exam";
import { usePlanetGetFirstQuestion } from "~/api/planet";
import { SimplifiedPlanet } from "~/api/student";
import { QuestionLoader } from "~/components/QuestionLoader";
import { PATH } from "~/constants/path";
import { useExamProgress } from "~/stores/exam-progress";
import { StagingQuestionInfo } from "../Debug/components/StagingQuestionInfo";
import { AudioInterface } from "~/sounds";
import { ScreenInfo } from "../Debug/components/ScreenInfo";

export function PlanetPage() {
  const location = useLocation();
  const params = useParams();
  const planet: SimplifiedPlanet = location.state?.planet;
  const planetId = planet?.planetId ?? params.planetId ?? "--ID_MISSING--";

  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const updateProgress = useExamProgress((state) => state.setValue);

  usePlanetGetFirstQuestion(planetId, {
    onSuccess: (question) => {
      if (!currentQuestion) {
        setCurrentQuestion(question);
        updateProgress(0);
      }
    },
  });

  function handleAnswer(
    answer:
      | Question
      | {
          planetCompleted?: true;
        },
    skipFeedback?: boolean
  ) {
    if ("planetCompleted" in answer) {
      navigate(`${PATH.DASHBOARD}?planet-completed=${planetId}`);
    } else {
      setCurrentQuestion(answer as Question);
      (answer as Question).progress &&
        updateProgress((answer as Question).progress as number);
    }

    /* Handle Feedback Sound */
    if (skipFeedback) return;

    if ("previousQuestionIsCorrect" in answer) {
      if (answer.previousQuestionIsCorrect === true) {
        AudioInterface.feedback.positive.play();
      }

      if (answer.previousQuestionIsCorrect === false) {
        AudioInterface.feedback.negative.play();
      }
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
        <Stack
          style={{ position: "fixed", bottom: 70, left: 30, zIndex: 999 }}
          id="debugger"
        >
          <StagingQuestionInfo
            question={{ ...currentQuestion, planetTitle: planet.planetName }}
          />
        </Stack>
      )}
      <div className="fixed bottom-4 left-6">
        <ScreenInfo />
      </div>
    </>
  );
}
