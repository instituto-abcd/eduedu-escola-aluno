import { Group, LoadingOverlay } from "@mantine/core";
import { ModelProps } from ".";
import { VideoPlayer } from "~/components/VideoPlayer";
import { EduButton } from "~/components/EduButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { usePlanetAnswer } from "~/api/planet";

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

  return (
    <>
      <Group my="auto">
        {videoTitles.map((title) => (
          <VideoPlayer
            src={title.file_url ?? ""}
            key={title.file_url}
            customWidth="800"
            customHeight="auto"
            autoPlay
          />
        ))}
      </Group>
      <EduButton onClick={submitAnswer}>Continuar</EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
