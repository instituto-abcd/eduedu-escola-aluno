import { Group, Image, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { IconVolume } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { QuestionOption } from "~/api/exam";
import { lousaWidth } from "~/utils/userScreen";

export function QME2x2Video({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (answer === null) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [answer],
    });
  }

  const { videoTitles } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      <Group noWrap grow spacing={75} py={40} my="auto">
        <div>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            autoPlay
            customHeight={(lousaWidth * 30 / 100).toString()}
          />
        </div>

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option) => (
            <OptionButton
              key={option.position}
              data-selected={JSON.stringify(answer) === JSON.stringify(option)}
              sound={option.sound_url ?? ""}
              onClick={() => setAnswer(option)}
              isCorrect={option.isCorrect}
            >
              {option.image_url && (
                <Image
                  src={option.image_url}
                  alt={option.description}
                  width="100%"
                />
              )}
              {!option.image_url && option.sound_url && (
                <IconVolume size={80} />
              )}
              {!option.image_url && !option.sound_url && option.description && (
                <Text>{option.description}</Text>
              )}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>

      <EduButton disabled={answer === null} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
