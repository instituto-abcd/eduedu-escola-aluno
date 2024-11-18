import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { ReadButton } from "~/components/ReadButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { IconVolume } from "@tabler/icons-react";
import {
  ImageTitle,
  TextBubble,
  TitleBubble,
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
    <div className="grow flex flex-col gap-5 size-full">
      {hasAudioTitle && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      {textTitles.map((title, inx) => (
        <TitleBubble
          key={inx}
          text={title.description}
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

        <ImageTitle titles={imageTitles} />

        <div className="grid grid-cols-2 grid-rows-2 gap-5 lg:h-full">
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
                  width={100}
                  style={{
                    maxHeight: 110,
                    objectFit: "contain",
                    marginInline: "auto",
                  }}
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
