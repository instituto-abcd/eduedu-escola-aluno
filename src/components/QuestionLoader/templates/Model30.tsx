import { Stack } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useTimeout } from "@mantine/hooks";
import { useEffect } from "react";

export function Model30({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay, imageTitles } =
    useQuestionHelper(question);

  const { start } = useTimeout(() => onConditionsChange([]), 1000);

  useEffect(() => {
    start();
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <div className="flex gap-4 lg:self-start">
          {audioTitles.map((title, inx) => (
            <AudioButton
              index={inx}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
            />
          ))}
        </div>
      )}

      <Stack my="auto">
        {imageTitles.length > 0 && (
          <>
            <img
              src={imageTitles[0].file_url ?? ""}
              className="h-[50vh] max-w-screen"
            />

            {/* Alguns estão vindo sem file_url,
              por isso adicionei esse texto para mostrar caso o file_url esteja vazio:
          */}
            {imageTitles[0].file_url?.length
              ? ""
              : "Ooops! Imagem não disponível :("}
          </>
        )}
      </Stack>
    </>
  );
}
