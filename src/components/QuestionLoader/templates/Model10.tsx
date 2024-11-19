import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { OptionButton } from "~/components/OptionButton";
import { IconVolume } from "@tabler/icons-react";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import {
  ImageTitle,
  TextBubble,
  TitleBubble,
} from "~/components/question-components";

export function Model10({
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

  return (
    <div className="grow flex flex-col gap-5 size-full">
      {hasAudioTitle && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      {imageTitles.length !== 0 &&
        textTitles
          .filter(
            (title) => title.description && !title.placeholder.includes("ID")
          )
          .map((title, inx) => (
            <TitleBubble
              key={inx}
              text={title.description ?? ""}
            />
          ))}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-5 md:gap-9 lg:h-[80vh] size-full grow">
        {imageTitles.length === 0 &&
          textTitles
            .filter(
              (title) => title.description && !title.placeholder.includes("ID")
            )
            .map((title, inx) => (
              <TextBubble
                key={inx}
                text={title.description ?? ""}
              />
            ))}

        <div className="lg:w-1/2">
          <ImageTitle titles={imageTitles} />
        </div>

        <div className="grid grid-cols-2 gap-5 lg:min-w-[50%]">
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              onClick={() =>
                setAnswer({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? +option.position
                    : undefined,
                })
              }
              data-selected={
                JSON.stringify(answer) ===
                JSON.stringify({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? option.position
                    : undefined,
                })
              }
              option={option}
            >
              {(!option.image_url || !hideTextRule) && (
                <>{option.description}</>
              )}

              {option.image_url && (
                <img
                  src={option.image_url}
                  alt={option.description}
                  className="max-h-[100px] xl:max-h-full object-contain mx-auto w-auto"
                />
              )}
              {!option.image_url && option.sound_url && !option.description && (
                <IconVolume size={80} />
              )}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}
