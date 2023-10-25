import { LoadingOverlay, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { Question, QuestionOption } from "~/api/exam";
import { usePlanetAnswer, usePlanetGetQuestion } from "~/api/planet";
import { useGetExamQuestion } from "~/api/student";
import { lousaHeight } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { EduButton } from "../EduButton";
import { ModelMapper } from "./ModelMapper";
import { ModelProps } from "./templates";

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

  const { hasAuxQuestion, auxQuestionId, skipFeedback } =
    useQuestionHelper(question);

  const { data: auxQuestion, isFetching: isLoadingAux } = usePlanetGetQuestion(
    question.planet_id,
    auxQuestionId ?? "",
    {
      enabled: hasAuxQuestion,
    }
  );

  const commonProps: ModelProps = {
    question,
    auxQuestion,
    setContinueDisabled,
    onAnswerChange: setAnswer,
  };

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q, skipFeedback),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q, skipFeedback),
  });

  const isLoading = isLoadingExam || isLoadingPlanet || isLoadingAux;

  function submitAnswer() {
    const isExam = !question.planet_id;

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

  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    mediaTrack.clearQueue();
    setAnswer([]);
    setContinueDisabled(true);
  }, [question]);

  useEffect(() => {
    setContinueDisabled(mediaTrack.isPlaying);
  }, [mediaTrack.isPlaying]);

  return (
    <Stack w="100%" h="100%" align="center" style={{ position: "relative" }}>
      <ModelMapper commonProps={commonProps} />

      <EduButton disabled={continueDisabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay
        visible={isLoading}
        style={{
          maxHeight: (lousaHeight * 80) / 100,
          borderRadius: 40,
          width: "100%",
        }}
      />
    </Stack>
  );
}
