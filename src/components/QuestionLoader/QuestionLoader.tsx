import { createStyles, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { Question, QuestionOption } from "~/api/exam";
import { usePlanetAnswer, usePlanetGetQuestion } from "~/api/planet";
import { useGetExamQuestion } from "~/api/student";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelMapper } from "./ModelMapper";
import { ModelProps } from "./templates";
import { useAudioStatus } from "~/stores/audio";
import { modelIsAutoAdvance } from "~/constants";
import { ButtonContinue } from "../Buttons";
import { BREAKPOINT } from "~/constants/dimensions";

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

  useEffect(() => {
    setAnswer([]);
    setContinueDisabled(true);
  }, [question]);

  const { isPlaying } = useAudioStatus();

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

  const { classes } = useStyles();

  return (
    <Stack
      className={classes.container}
      id="question-loader"
    >
      <ModelMapper commonProps={commonProps} />

      <ButtonContinue
        disabled={continueDisabled}
        onClick={submitAnswer}
        className={classes.continue}
      />
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    "&>*": {
      maxWidth: 1280,
    },
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      padding: 30,
    },
  },
  continue: {
    marginTop: "auto",
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      alignSelf: "end",
    },
  },
}));
