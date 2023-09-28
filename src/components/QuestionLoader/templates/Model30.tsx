import { Group, LoadingOverlay } from "@mantine/core";
import { EduButton } from "~/components/EduButton/EduButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight } from "~/constants/dimensions";

export function Model30({ question, answerCallback }: ModelProps) {
  const { audioTitles, imageTitles } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (mediaTrack.isPlaying) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [],
    });
  }

  return (
    <>
      {audioTitles.length > 0 && (
        <Group>
          {audioTitles
            .filter((title) => !!title.file_url)
            .map((title, inx) => (
              <AudioButton
                src={title.file_url!}
                autoPlay={inx === 0}
                key={title.file_url}
              />
            ))}
        </Group>
      )}

      {imageTitles.length > 0 && (
        <img
          src={imageTitles[0].file_url ?? ""}
          width={424}
          style={{ maxHeight: 430, height: "auto" }}
          height="auto"
        />
      )}

      <EduButton disabled={mediaTrack.isPlaying} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
