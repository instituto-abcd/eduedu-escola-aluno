import { useEffect } from "react";
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
import { useStudent } from "~/stores/student";
import { questionProgressKey } from "~/stores/question-progress";
import { usePersistedQuestion } from "~/hooks/usePersistedQuestion";

export function PlanetPage() {
  const location = useLocation();
  const params = useParams();
  const planet: SimplifiedPlanet = location.state?.planet;
  const planetId = planet?.planetId ?? params.planetId ?? "--ID_MISSING--";

  const navigate = useNavigate();

  const studentId = useStudent((state) => state.id);
  const {
    question: currentQuestion,
    setQuestion: setCurrentQuestion,
    isRestored,
  } = usePersistedQuestion(questionProgressKey.planet(studentId, planetId));
  const updateProgress = useExamProgress((state) => state.setValue);

  useEffect(() => {
    if (isRestored) updateProgress(currentQuestion?.progress ?? 0);
  }, []);

  // Ao restaurar, não busca a primeira questão: o backend zeraria as respostas.
  usePlanetGetFirstQuestion(planetId, {
    enabled: !isRestored,
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
  // TODO: use new env
  const showStagingInfo = false;

  return (
    <>
      {currentQuestion && (
        <QuestionLoader
          question={currentQuestion}
          answerCallback={handleAnswer}
        />
      )}

      {currentQuestion && showStagingInfo && (
        <div
          className="fixed bottom-[70px] left-[30px] z-[999]"
          id="debugger"
        >
          <StagingQuestionInfo
            question={{ ...currentQuestion, planetTitle: planet.planetName }}
          />
        </div>
      )}
      <div className="fixed bottom-4 left-6">
        <ScreenInfo />
      </div>
    </>
  );
}
