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
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles.length > 0 && (
          audioTitles
            .filter((title) => !!title.file_url)
            .map((title, inx) => (
              <AudioButton
                src={title.file_url!}
                autoPlay={inx === 0}
                key={title.file_url}
              />
            ))
        )}
      </Group>

      {/* Board content */}
      {imageTitles.length > 0 && (
        <>
          <img
            src={imageTitles[0].file_url ?? ""}
            width="auto"
            height={lousaHeight * 55 / 100}
          />

          {/* Alguns estão vindo sem file_url,
              por isso adicionei esse texto para mostrar caso o file_url esteja vazio:
          */}
          {imageTitles[0].file_url?.length ? '' : "Ooops! Imagem não disponível :("}
        </>
      )}

      {/* Continue to the next screen button */}
      <EduButton
        disabled={mediaTrack.isPlaying}
        onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
