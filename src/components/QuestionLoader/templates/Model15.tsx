// Utils & Aux:
import { useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { usePlanetAnswer } from "~/api/planet";
import { ModelProps } from ".";

// Components:
import { Group, LoadingOverlay } from "@mantine/core";
import { VideoPlayer } from "~/components/VideoPlayer";
import { EduButton } from "~/components/EduButton";

export function Model15({ question, answerCallback }: ModelProps) {
  const { videoTitles } = useQuestionHelper(question);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [],
    });
  }

  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <>
      <Group my="auto">
        {videoTitles.map((title) => (
          <VideoPlayer
            src={title.file_url ?? ""}
            key={title.file_url}
            autoPlay
            onPlayStatusChange={(value) => setIsPlaying(value)}
          />
        ))}
      </Group>
      <EduButton onClick={submitAnswer} isDisabled={isPlaying}>Continuar</EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
