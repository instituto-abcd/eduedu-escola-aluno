import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useEffect } from "react";

export function Model30({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay, imageTitles } =
    useQuestionHelper(question);

  useEffect(() => {
    const timer = setTimeout(() => {
      onConditionsChange([]);
    }, 1000);

    return () => clearTimeout(timer);
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

      <div className="my-auto flex flex-col space-y-4">
        {imageTitles.length > 0 && (
          <>
            <img
              src={imageTitles[0].file_url ?? ""}
              className="h-[50vh] max-w-screen"
              alt="Imagem do título"
            />

            {!imageTitles[0].file_url?.length && (
              <p className="text-center text-red-500">
                Ooops! Imagem não disponível :(
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
