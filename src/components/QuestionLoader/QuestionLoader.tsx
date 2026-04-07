import { useEffect, useState } from "react";
import type { Question, QuestionOption } from "~/api/exam";
import { usePlanetAnswer, usePlanetGetQuestion } from "~/api/planet";
import { useGetExamQuestion } from "~/api/student";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelMapper } from "./ModelMapper";
import type { ModelProps } from "./templates";
import { useAudioStatus } from "~/stores/audio";
import { modelIsAutoAdvance } from "~/constants";
import { ButtonContinue } from "../Buttons";
import { cx } from "~/utils/cx";
// import { Header } from "../question-components/Header";

type QuestionLoaderProps = {
  answerCallback: (
    nextQuestion: Question | { examCompleted?: true; planetCompleted?: true },
    skipFeedback?: boolean
  ) => void;
  question: Question;
};

export function QuestionLoader({
  question,
  answerCallback,
}: QuestionLoaderProps) {
  const [answer, setAnswer] = useState<QuestionOption[]>([]);
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [conditions, setConditions] = useState<boolean[]>([]);

  const { hasAuxQuestion, auxQuestionId, skipFeedback } =
    useQuestionHelper(question);

  const { data: auxQuestion } = usePlanetGetQuestion(
    question.planet_id,
    auxQuestionId ?? "",
    {
      enabled: hasAuxQuestion,
    }
  );

  const commonProps: ModelProps = {
    question,
    auxQuestion,
    onAnswerChange: setAnswer,
    onConditionsChange: setConditions,
  };

  const { mutate: mutateExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q, skipFeedback),
  });

  const { mutate: mutatePlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q, skipFeedback),
  });

  function submitAnswer() {
    const isExam = !question.planet_id;

    setContinueDisabled(true);

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: answer,
      });
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: answer,
      });
    }
  }

  const { isPlaying, resetPlaying } = useAudioStatus();

  useEffect(() => {
    setAnswer([]);
    setContinueDisabled(true);
    resetPlaying();
  }, [question]);
  /* Conditions - bloqueio de continuar */
  useEffect(() => {
    const shouldEnableContinue = [...conditions, !isPlaying].every(
      (bool) => bool === true
    );

    setContinueDisabled(!shouldEnableContinue);
  }, [conditions, isPlaying]);

  /* Auto-advance logic */
  useEffect(() => {
    if (continueDisabled === true) return;
    if (!modelIsAutoAdvance(question.model_id)) return;
    if (answer.length === 0) return;

    submitAnswer();
  }, [continueDisabled]);

  /* Blacklist for models that hide the continue button */
  const continueBlacklist = ["MODEL13", "MODEL12"];
  const hideContinue = continueBlacklist.includes(question.model_id);

  return (
    <div
      className="grow h-screen flex flex-col items-center bg-white p-3 xl:p-8"
      id="question-loader"
    >
      <ModelMapper key={question.id} commonProps={commonProps} />

      <ButtonContinue
        disabled={continueDisabled}
        onClick={submitAnswer}
        className={cx("mt-5 md:mt-auto md:self-end", {
          hidden: hideContinue,
        })}
      />
    </div>
  );
}
