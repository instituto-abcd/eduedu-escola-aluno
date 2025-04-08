import { Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { BasicOptionButton } from "~/components/BasicOptionButton";

export function Model8({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { textTitles, audioTitles, audioTitleAutoplay, hasAudioTitle } =
    useQuestionHelper(question);

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

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

      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-evenly">
        {textTitles.map((title, inx) => (
          <Title
            color="dark.3"
            size="1.3rem"
            align="center"
            key={inx}
            dangerouslySetInnerHTML={{ __html: title.description }}
            className="w-full lg:w-1/2"
          />
        ))}

        <div className="w-full lg:w-1/2 flex flex-col items-center">
          {question.options.map((option, inx) => (
            <BasicOptionButton
              key={inx}
              onClick={() => setAnswer(option)}
              option={option}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              className="text-[1.3rem] p-4 my-2 w-[80%]"
            >
              {option.description}
            </BasicOptionButton>
          ))}
        </div>
      </div>
    </>
  );
}
