import { ScrollArea, Text, Title } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useEffect } from "react";
import { useTimeout } from "@mantine/hooks";

export function Model21({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, textTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);

  const title =
    textTitles.find((title) => title.position === 1)?.description ?? "";

  const statement =
    textTitles.find((title) => title.position === 2)?.description ?? "";

  const { start } = useTimeout(() => onConditionsChange([true]), 1000);

  useEffect(() => {
    start();
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
          <Title
            color="dark.3"
            size={boardW(30)}
            className="text-center text-2xl"
          >
            {title}
          </Title>
        )}

        <ScrollArea
          type="always"
          className="px-10 max-h-[80%]"
        >
          <Text
            dangerouslySetInnerHTML={{ __html: statement }}
            color="dark.3"
            className="text-center text-xl"
          />
        </ScrollArea>
      </div>
    </div>
  );
}
