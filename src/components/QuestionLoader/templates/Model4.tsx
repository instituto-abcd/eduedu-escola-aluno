import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model4({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const {
    audioTitles,
    textTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    getRule,
    isExam,
  } = useQuestionHelper(question);

  const hideOptionsTextRule = getRule("options_hide_text");
  const showOptionsText =
    hideOptionsTextRule && hideOptionsTextRule.value === "false" ? false : true;

  const hasDescription = (description: string) =>
    description !== null && description !== "";

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

      <div className="h-full w-full flex flex-col items-center justify-evenly">
        <div className="flex flex-wrap gap-5 items-center justify-center">
          {textTitles.map((title) => (
            <h2
              key={title.description}
              dangerouslySetInnerHTML={{ __html: title.description }}
              className="text-xl text-center font-semibold text-zinc-700"
            />
          ))}
          {imageTitles.map((title) => (
            <div
              className="max-h-[150px]"
              key={title.file_url}
            >
              <img
                src={title.file_url}
                alt={title.description}
                className="max-h-[150px] max-w-[150px] min-h-[150px] min-w-[150px] object-contain"
              />
            </div>
          ))}
        </div>

        <div className="flex w-full md:w-2/3 lg:w-full flex-wrap justify-center items-center">
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              onClick={() => setAnswer(option)}
              option={option}
              className="h-[125px] w-[125px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] m-4 flex items-center justify-center"
            >
              {option.image_url ? (
                <>
                  <img
                    src={option.image_url}
                    alt={option.description}
                    className="pointer-events-none select-none mx-auto object-contain max-w-[60%]"
                  />
                  {!isExam &&
                    showOptionsText &&
                    hasDescription(option.description) && (
                      <p className="text-sm text-gray-700 font-semibold mt-2 text-center">
                        {option.description}
                      </p>
                    )}
                </>
              ) : (
                <p className="text-[2vh] text-zinc-700 text-center">
                  {option.description}
                </p>
              )}
            </OptionButton>
          ))}
        </div>
      </div>
    </>
  );
}
