import { Group, LoadingOverlay } from "@mantine/core";
import { ModelProps } from ".";
import { VideoPlayer } from "~/components/VideoPlayer";
import { EduButton } from "~/components/EduButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { usePlanetAnswer } from "~/api/planet";
import { useMediaTrackStore } from "~/stores/media-track.store";

export function Model15({ question, answerCallback }: ModelProps) {
  const { videoTitles } = useQuestionHelper(question);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const mediaTrack = useMediaTrackStore();

  function submitAnswer() {
    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [],
    });
  }

  return (
    <>
      <Group my="auto">
        {videoTitles.map((title) => (
          <VideoPlayer
            src={title.file_url ?? ""}
            key={title.file_url}
            autoPlay
            onPlayStatusChange={mediaTrack.setPlayStatus}
          />
        ))}
      </Group>
      <EduButton
        onClick={submitAnswer}
        disabled={mediaTrack.isPlaying}
        withFeedbackSound={false}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
