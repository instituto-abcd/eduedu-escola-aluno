// Aux & Utils:
import { useState } from "react";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useGetExamQuestion } from "~/api/student";
import { usePlanetAnswer } from "~/api/planet";
import { useMediaTrackStore } from "~/stores/media-track.store";

// Components:
import {
  Group,
  SimpleGrid,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { EduButton } from "~/components/EduButton";
import { AudioButton } from "~/components/AudioButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import {
  OptionButton,
  TextOptionButton,
} from "~/components/OptionButton";
import { lousaHeight } from "~/constants/dimensions";

export function Model5({ question, answerCallback }: ModelProps) {
  const { audioTitles, videoTitles, textTitles, imageTitles, isExam } =
    useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const [multipleAnswer, setMultipleAnswer] = useState<QuestionOption[]>([]);
  const mediaTrack = useMediaTrackStore();

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;
  const disabled = question.multiplesAnswer
    ? multipleAnswer.length === 0
    : !answer;

  function submitAnswer() {
    if (disabled) return;

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: question.multiplesAnswer
          ? multipleAnswer
          : answer
            ? [answer]
            : [],
      });
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: question.multiplesAnswer
          ? multipleAnswer
          : answer
            ? [answer]
            : [],
      });
    }
  }

  function handleOptionClick(option: QuestionOption) {
    if (question.multiplesAnswer) {
      if (multipleAnswer.includes(option)) {
        setMultipleAnswer(
          multipleAnswer.filter(
            (opt) => JSON.stringify(opt) !== JSON.stringify(option)
          )
        );
      } else {
        setMultipleAnswer([...multipleAnswer, option]);
      }
    } else setAnswer(option);
  }

  function getSelectedState(option: QuestionOption) {
    if (question.multiplesAnswer) {
      return multipleAnswer.includes(option);
    } else {
      return JSON.stringify(answer) === JSON.stringify(option);
    }
  }

  const hasVideo = videoTitles.some((title) => title.file_url);
  const hasText = textTitles.some(
    (title) => !title.placeholder.startsWith("ID")
  );
  const hasImage = imageTitles.some((title) => title.file_url);

  return (
    <>
      {/* Action buttons */}
      <Group>
        {audioTitles.map((title, inx) => (
          <AudioButton
            src={title.file_url ?? ""}
            key={inx}
            autoPlay={inx === 0}
          />
        ))}
      </Group>

      {/* Board content */}
      <Group spacing={80} m="auto">
        {!hasVideo && hasText && (
          <Title color="dark.3" size="2.5vh" align="center" my="auto" maw={400}>
            {textTitles[0].description}
          </Title>
        )}

        {hasImage &&
          imageTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <img src={title.file_url!} width={350} key={inx} />
            ))}

        {videoTitles
          .filter((title) => title.file_url)
          .map((title, inx) => (
            <VideoPlayer
              src={title.file_url!}
              key={inx}
              autoPlay
              onPlayStatusChange={mediaTrack.setPlayStatus}
              canPlay={mediaTrack.canPlay()}
            />
          ))}

        <SimpleGrid cols={2} w="full" my="auto">
          {question.options.map((option, inx) =>
            option.image_url ? (
              <OptionButton
                key={inx}
                onClick={() => handleOptionClick(option)}
                data-selected={getSelectedState(option)}
                sound={option.sound_url ?? undefined}
              >
                <img
                  src={option.image_url}
                  alt={option.description}
                  style={{
                    maxWidth: 120,
                    maxHeight: 120,
                    objectFit: "contain"
                  }}
                />
              </OptionButton>
            ) : (
              <TextOptionButton
                key={inx}
                onClick={() => setAnswer(option)}
                data-selected={
                  JSON.stringify(answer) === JSON.stringify(option)
                }
              >
                {option.description}
              </TextOptionButton>
            )
          )}
        </SimpleGrid>
      </Group>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={disabled}
        onClick={submitAnswer}
        style={{
          marginTop: "auto"
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
