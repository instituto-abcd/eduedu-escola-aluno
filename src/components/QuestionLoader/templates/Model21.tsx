import { AudioButton } from "~/components/AudioButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useEffect } from "react";

export function Model21({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, textTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);

  const title =
    textTitles.find((title) => title.position === 1)?.description ?? "";

  const statement =
    textTitles.find((title) => title.position === 2)?.description ?? "";

  useEffect(() => {
    const timer = setTimeout(() => {
      onConditionsChange([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [question]);

  return (
    <div className="flex flex-col items-center justify-center">
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

      <div className="w-[90%] h-full max-w-full flex flex-col justify-evenly items-center">
        {title !== "" && (
          <h2
            className="text-center text-zinc-700 font-semibold text-2xl"
            style={{ fontSize: boardW(30) }}
          >
            {title}
          </h2>
        )}

        <div className="overflow-y-auto px-10 max-h-[80%] w-full">
          <p
            className="text-center text-xl text-zinc-700"
            dangerouslySetInnerHTML={{ __html: statement }}
          />
        </div>
      </div>
    </div>
  );
}
