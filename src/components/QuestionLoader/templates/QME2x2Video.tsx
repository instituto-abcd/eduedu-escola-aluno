import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { useGetExamQuestion } from "~/api/student";
import { QuestionOption } from "~/api/exam";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { ModelProps } from ".";
import {
  Box,
  Group,
  Image,
  LoadingOverlay,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { IconVolume } from "@tabler/icons-react";

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
      <Group my="auto" spacing={boardW(80)} noWrap>
        <Box w="45%">
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            autoPlay
            style={{ height: boardW(250) }}
          />
        </Box>

        <SimpleGrid
          cols={2}
          style={{ placeItems: "center", marginBottom: "5px" }}
          w="45%"
        >
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

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
