import { Group } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { lousaHeight } from "~/constants/dimensions";

export function Model30({ question }: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay, imageTitles } =
    useQuestionHelper(question);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles
            .filter((title) => !!title.file_url)
            .map((title, inx) => (
              <AudioButton
                src={title.file_url!}
                autoPlay={audioTitleAutoplay(inx)}
                key={title.file_url}
              />
            ))}
        </Group>
      )}

      {imageTitles.length > 0 && (
        <>
          <img
            src={imageTitles[0].file_url ?? ""}
            width="auto"
            height={(lousaHeight * 55) / 100}
          />

          {/* Alguns estão vindo sem file_url,
              por isso adicionei esse texto para mostrar caso o file_url esteja vazio:
          */}
          {imageTitles[0].file_url?.length
            ? ""
            : "Ooops! Imagem não disponível :("}
        </>
      )}
    </>
  );
}
