import { Group, LoadingOverlay, SimpleGrid, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { DraggableCardSlot, DraggableCard } from "~/components/DraggableCard";
import { useCallback, useEffect, useState } from "react";
import { produce } from "immer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { useGetExamQuestion } from "~/api/student";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";

export function Model2({ question, answerCallback }: ModelProps) {
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;

  function submitAnswer() {
    if (answers.includes(null)) return;

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: answers as QuestionOption[],
      })
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: answers as QuestionOption[],
      });
    }
  }

  const handleDrop = useCallback(function (
    item: QuestionOption | null,
    index: number
  ) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item ? { ...item, positionAnswer: index } : item;
      })
    );
  },
  []);

  const { audioTitles, isExam } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setAnswers(question.options.map(() => null));
  }, [question]);

  return (
    <>
      <Group>
        {audioTitles.map((title) => (
          <AudioButton
            key={title.file_url}
            src={title.file_url ?? ""}
            autoPlay
          />
        ))}
      </Group>

      <Stack my="auto">
        <SimpleGrid cols={question.options.length} spacing={24}>
          {answers.map((slot, inx) => (
            <DraggableCardSlot
              key={inx}
              onDrop={(item) => handleDrop(item, inx)}
              item={slot}
              replaceWith={
                <DraggableCard
                  item={slot}
                  image={slot?.image_url}
                  text={slot?.description}
                  sound={slot?.sound_url}
                  disabled
                  onClear={() => handleDrop(null, inx)}
                />
              }
            />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={question.options.length} spacing={24}>
          {question.options.map((item) => (
            <DraggableCard
              item={item}
              key={item.position}
              image={item.image_url}
              text={item.description}
              sound={item.sound_url}
              hidden={
                !!answers.find((slot) => slot?.position === item.position) ||
                mediaTrack.isPlaying
              }
            />
          ))}
        </SimpleGrid>
      </Stack>

      <EduButton disabled={answers.includes(null)} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
