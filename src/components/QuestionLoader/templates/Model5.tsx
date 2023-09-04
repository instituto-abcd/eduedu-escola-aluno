import { Group, LoadingOverlay, SimpleGrid, Title } from "@mantine/core";
import { EduButton } from "~/components/EduButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useGetExamQuestion } from "~/api/student";
import { useState } from "react";
import { QuestionOption } from "~/api/exam";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useMediaTrackStore } from "~/stores/media-track.store";

export function Model5({ question, answerCallback }: ModelProps) {
  const { audioTitles, videoTitles, textTitles, imageTitles } =
    useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const [multipleAnswer, setMultipleAnswer] = useState<QuestionOption[]>([]);
  const mediaTrack = useMediaTrackStore();

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
      {audioTitles.map((title, inx) => (
        <AudioButton
          src={title.file_url ?? ""}
          key={inx}
          autoPlay={inx === 0}
        />
      ))}

      <Group spacing={80} align="center" my="auto">
        {!hasVideo && hasText && (
          <Title color="dark.3" size={30} align="center" my="auto" maw={400}>
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
                  width={100}
                  style={{
                    maxHeight: 140,
                    objectFit: "contain",
                    marginInline: "auto",
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

      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
