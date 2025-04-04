import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { validString } from "~/utils/string";
import {
  ImageTitle,
  TextBubble,
  CardOption,
} from "~/components/question-components";

export function Model10Prova({
  question,
  onAnswerChange,
  auxQuestion,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, hasAudioTitle, getRule } =
    useQuestionHelper(question);

  const hideTextRule = getRule("options_hide_text")?.value === "true";

  // Usado para extrair os títulos de texto verdadeiros
  // uma vez que ID de questão auxiliar aparece como title type text
  const regularTextTitles = textTitles.filter(
    (title) =>
      validString(title.description) && !title.placeholder.includes("ID")
  );

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  return (
    <div className="grow flex flex-col gap-5 size-full max-h-[80vh]">
      {hasAudioTitle && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      {textTitles.map((title, inx) => (
        <p
          key={inx}
          dangerouslySetInnerHTML={{ __html: title.description }}
          className={"text-text text-center text-xl md:text-2xl xl:text-4xl"}
        />
      ))}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-5 md:gap-9 size-full">
        {(imageTitles.length > 0 || regularTextTitles.length > 0) && (
          <div className="lg:w-1/2 max-w-[600px] lg:h-full lg:max-h-[400px]">
            {imageTitles.length === 0 &&
              regularTextTitles.map((title, inx) => (
                <TextBubble
                  key={inx}
                  text={title.description ?? ""}
                />
              ))}

            <ImageTitle titles={imageTitles} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 lg:w-[50%] lg:aspect-square content-center justify-items-stretch">
          {question.options.map((option, inx) => (
            <CardOption
              className="lg:odd:ml-auto"
              key={inx}
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
  );
}
