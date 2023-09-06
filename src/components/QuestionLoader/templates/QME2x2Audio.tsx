import { Group, LoadingOverlay, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconVolume } from "@tabler/icons-react";
import { OptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { AudioControls } from "~/components/AudioControls/AudioControls";
import { useGetExamQuestion } from "~/api/student";
import { useEffect, useRef, useState } from "react";
import { EduButton } from "~/components/EduButton";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { useMediaTrackStore } from "~/stores/media-track.store";

export function QME2x2Audio({ question, answerCallback }: ModelProps) {
  const { audioTitles } = useQuestionHelper(question);

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [answer],
    });
  }

  const cols = question.options.length < 6 ? question.options.length / 2 : 3;

  const [currentAudio, setCurrentAudio] =
    useState<QuestionTitleClassification | null>(
      QuestionTitleClassification.INTRO
    );

  const introRef = useRef<HTMLAudioElement>(null);
  const historyRef = useRef<HTMLDivElement & { play: () => void }>(null);
  const questionRef = useRef<HTMLDivElement & { play: () => void }>(null);

  useEffect(() => {
    switch (currentAudio) {
      case QuestionTitleClassification.INTRO:
        void introRef.current?.play();
        break;
      case QuestionTitleClassification.HISTORIA:
        historyRef.current?.play();
        break;
      case QuestionTitleClassification.ENUNCIADO:
        questionRef.current?.play();
        break;
    }
  }, [currentAudio]);

  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setAnswer(null);
    void introRef.current?.play();
  }, [question]);

  return (
    <>
      {audioTitles
        .filter(
          (title) =>
            title.classification === QuestionTitleClassification.HISTORIA
        )
        .map((title) => (
          <AudioControls
            src={title.file_url ?? ""}
            key={title.file_url}
            ref={historyRef}
            onEnded={() => {
              setCurrentAudio(QuestionTitleClassification.ENUNCIADO);
              mediaTrack.setPlayStatus(false);
            }}
            onPlay={() => mediaTrack.setPlayStatus(true)}
            onPause={() => mediaTrack.setPlayStatus(false)}
          />
        ))}

      <Group>
        {audioTitles
          .filter(
            (title) =>
              title.classification === QuestionTitleClassification.ENUNCIADO
          )
          .map((title) => (
            <AudioButton
              src={title.file_url ?? ""}
              key={title.file_url}
              ref={questionRef}
            />
          ))}

        {audioTitles
          .filter(
            (title) =>
              title.classification === QuestionTitleClassification.INTRO
          )
          .map((title) => (
            <audio
              src={title.file_url ?? ""}
              key={title.file_url}
              style={{ display: "none" }}
              ref={introRef}
              onEnded={() => {
                setCurrentAudio(QuestionTitleClassification.HISTORIA);
                mediaTrack.setPlayStatus(false);
              }}
              onPlay={() => mediaTrack.setPlayStatus(true)}
              onPause={() => mediaTrack.setPlayStatus(false)}
            />
          ))}
      </Group>

      <SimpleGrid cols={cols}>
        {question.options.map((option, inx) => {
          const hasLabel =
            option.description !== null && option.description.length > 2;
          return (
            <OptionButton
              key={inx}
              sound={option.sound_url ?? ""}
              onClick={() => setAnswer(option)}
              data-selected={answer?.position === option.position}
              isCorrect={option.isCorrect}
            >
              <Stack justify="space-evenly">
                {!hasLabel && <IconVolume size={62} />}
                <Text
                  color="dark.6"
                  size={hasLabel ? 17 : 30}
                  weight={hasLabel ? 600 : 400}
                  style={{ wordBreak: "break-word" }}
                >
                  {hasLabel ? option.description : inx + 1}
                </Text>
              </Stack>
            </OptionButton>
          );
        })}
      </SimpleGrid>
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{ minHeight: "max-content" }}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
