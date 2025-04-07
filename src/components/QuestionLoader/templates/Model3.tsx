import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { Text, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { QuestionOption } from "~/api/exam";
import { ModelProps } from ".";

export function Model3({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const {
    videoTitles,
    textTitles,
    hasAudioTitle,
    audioTitles,
    audioTitleAutoplay,
  } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

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
      {textTitles.map((title) => (
        <Title
          key={title.description}
          dangerouslySetInnerHTML={{ __html: title.description }}
          color="dark.3"
          className="text-xl text-center font-semibold"
        />
      ))}
      <div className="h-full w-full flex flex-wrap items-center justify-center">
        {videoTitles[0]?.file_url && (
          <div className="max-w-[500px] w-full md:w-1/2">
            <VideoPlayer
              src={videoTitles[0].file_url}
              autoPlay
              key={question.id}
            />
          </div>
        )}

        <div className="flex w-full max-w-[500px] max-h-[500px] overflow-auto lg:w-1/2 flex-wrap justify-center items-center">
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              onClick={() => setAnswer(option)}
              option={option}
              className="h-[40%] w-[40%] rounded-[15%] lg:w-[200px] lg:h-[200px] m-[5%] md:m-4 flex items-center justify-center"
            >
              {option.image_url && (
                <>
                  <img
                    src={option.image_url}
                    alt={option.description}
                    className="pointer-events-none select-none mx-auto object-contain max-w-[60%]"
                  />
                  {option.description}
                </>
              )}
              {!option.image_url && (
                <Text size={"2vh"}>{option.description}</Text>
              )}
            </OptionButton>
          ))}
        </div>
      </div>
    </>
  );
}
