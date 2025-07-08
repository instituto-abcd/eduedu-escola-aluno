import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import { CardOption } from "~/components/question-components";
import { validString } from "~/utils/string";
import { cx } from "~/utils/cx";
import { TextTitle } from "~/components/question-components/TextTitle";

export function Model10Prova({
  question,
  auxQuestion,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, hasAudioTitle, getRule } =
    useQuestionHelper(question);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const hideTextRule = getRule("options_hide_text")?.value === "true";

  // Usado para extrair os títulos de texto verdadeiros
  // uma vez que ID de questão auxiliar aparece como title type text
  const regularTextTitles = textTitles.filter(
    (title) =>
      validString(title.description) && !title.placeholder.includes("ID")
  );

  return (
    <>
      {hasAudioTitle && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}
      <div className="flex flex-col size-full">
        {imageTitles.length !== 0 &&
          regularTextTitles.map((title, inx) => (
            <div
              className="text-text font-bold text-lg text-center md:text-2xl"
              key={inx}
              dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
            />
          ))}

        <div className="flex flex-col lg:flex-row items-center justify-evenly flex-1">
          {/* Content container */}
          {(imageTitles.length > 0 || regularTextTitles.length > 0) && (
            <div className="flex flex-col justify-center items-center">
              {imageTitles.length === 0 &&
                regularTextTitles.map((title, inx) => (
                  <TextTitle
                    text={title.description}
                    key={inx}
                  />
                ))}

              <div className="flex justify-center items-center">
                {imageTitles.map((title) => (
                  <img
                    src={title.file_url!}
                    alt={title.description}
                    key={title.file_url}
                    height={300}
                    className="object-contain max-w-[90%] w-[295px] max-h-[200px] lg:max-w-[400px] lg:max-h-[400px] lg:h-full lg:w-full lg:min-h-[300px] lg:min-w-[300px]"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Option container */}
          <div
            className={cx(
              // BASE
              "aspect-square w-full h-1/2 max-h-[400px] justify-items-center items-center grid grid-cols-2 gap-5 max-w-[700px]",
              { ["grid-rows-3"]: question.options.length === 6 },
              // TABLET VERT
              "md:aspect-auto",
              // TABLET HORZ
              "lg:w-[50%] lg:max-h-[450px] lg:h-auto lg:aspect-square lg:justify-items-center lg:items-center"
            )}
          >
            {question.options.map((option, inx) => (
              <CardOption
                key={inx}
                className="h-full"
                onClick={() =>
                  setAnswer({
                    ...option,
                    positionAnswer: question.orderedAnswer
                      ? +option.position
                      : undefined,
                  })
                }
                selected={
                  JSON.stringify(answer) ===
                  JSON.stringify({
                    ...option,
                    positionAnswer: question.orderedAnswer
                      ? option.position
                      : undefined,
                  })
                }
                option={option}
                properties={[hideTextRule ? null : "text", "image", "audio"]}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
