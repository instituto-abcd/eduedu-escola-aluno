import { Loader, Stack } from "@mantine/core";
import { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Question } from "~/api/exam";
import { usePlanetGetFirstQuestion } from "~/api/planet";
import { Planet } from "~/api/student";
import { QuestionLoader } from "~/components/QuestionLoader";
import { PATH } from "~/constants/path";
import { useExamProgress } from "~/stores/exam-progress";
import feedbackNegative from "~/assets/audio/feedback_error.mp3";
import feedbackPositive from "~/assets/audio/feedback_button_next.mp3";

export function PlanetPage() {
  const location = useLocation();
  const params = useParams();
  const planet: Planet = location.state?.planet;
  const planetId = planet?.id ?? params.planetId ?? "--ID_MISSING--";

  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const updateProgress = useExamProgress((state) => state.setValue);

  const { isLoading } = usePlanetGetFirstQuestion(planetId, {
    onSuccess: (question) => {
      if (!currentQuestion) {
        setCurrentQuestion(question);
      }
    },
  });

  const negativeSound = useRef<HTMLAudioElement>(null);
  const positiveSound = useRef<HTMLAudioElement>(null);

  function handleAnswer(
    answer:
      | Question
      | {
          planetCompleted?: true;
        }
  ) {
    if ("planetCompleted" in answer) {
      navigate(`${PATH.DASHBOARD}?planet-completed=${planetId}`);
    } else {
      setCurrentQuestion(answer as Question);
      (answer as Question).progress &&
        updateProgress((answer as Question).progress as number);

      /* Handle Feedback Sound */

      if ("previousQuestionIsCorrect" in answer) {
        if (answer.previousQuestionIsCorrect === true) {
          void positiveSound.current?.play();
        }

        if (answer.previousQuestionIsCorrect === false) {
          void negativeSound.current?.play();
        }
      }
    }
  }

  return (
    <>
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

      <audio
        src={feedbackNegative}
        ref={negativeSound}
        style={{ display: "none" }}
      />
      <audio
        src={feedbackPositive}
        ref={positiveSound}
        style={{ display: "none" }}
      />
    </>
  );
}
