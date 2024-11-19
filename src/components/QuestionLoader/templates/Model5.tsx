import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import { ImageTitle, TitleBubble } from "~/components/question-components";
import { VideoTitle } from "~/components/question-components/VideoTitle";
import { CardOption } from "~/components/question-components/card-option";

export function Model5({
  question,
  onAnswerChange,
  onConditionsChange,
  auxQuestion,
}: ModelProps) {
  const { videoTitles, textTitles, imageTitles, hasAudioTitle, supportText } =
    useQuestionHelper(question);

  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const [multipleAnswer, setMultipleAnswer] = useState<QuestionOption[]>([]);

  function handleOptionClick(option: QuestionOption) {
    if (question.multiplesAnswer) {
      if (multipleAnswer.includes(option)) {
        setMultipleAnswer(
          multipleAnswer.filter(
            (opt) => JSON.stringify(opt) !== JSON.stringify(option)
          )
        );
      } else {
        setMultipleAnswer([...multipleAnswer, option]);
      }
    } else setAnswer(option);
  }

  function getSelectedState(option: QuestionOption) {
    if (question.multiplesAnswer) {
      return multipleAnswer.includes(option);
    } else {
      return JSON.stringify(answer) === JSON.stringify(option);
    }
  }

  const hasVideo = videoTitles.some((title) => title.file_url);
  const hasText = textTitles.some(
    (title) => !title.placeholder?.startsWith("ID")
  );
  const hasSupportText = supportText.some((title) => !!title.description);

  /* Handle answer */
  useEffect(() => {
    if (question.multiplesAnswer) {
      onAnswerChange(multipleAnswer);
    } else {
      onAnswerChange(answer ? [answer] : []);
    }
  }, [answer, multipleAnswer]);

  /* handle clear answers */
  useEffect(() => {
    setAnswer(null);
    setMultipleAnswer([]);
  }, [question]);

  /* Conditions */
  const conditions = useMemo(
    () =>
      question.multiplesAnswer
        ? [multipleAnswer.length > 0]
        : [Boolean(answer)],
    [answer, multipleAnswer]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      {(hasAudioTitle || hasSupportText) && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      <div className="flex flex-col items-center size-full my-auto lg:flex-row">
        {/* Titles */}
        <div className="w-fit flex flex-col items-center lg:justify-center lg:min-w-[50%] lg:h-full">
          {!hasVideo && hasText && (
            <TitleBubble
              text={
                textTitles.find(
                  (title) =>
                    !title.placeholder?.startsWith("ID") ||
                    !title.placeholder?.includes("ID")
                )?.description ?? ""
              }
            />
          )}

          <ImageTitle titles={imageTitles} />
          <VideoTitle titles={videoTitles} />
        </div>

        {/* Options */}
        <div className="max-h-full lg:size-full grid grid-cols-2 gap-6 place-items-center">
          {question.options.map((option, inx) => (
            <CardOption
              key={inx}
              onClick={() => handleOptionClick(option)}
              selected={getSelectedState(option)}
              option={option}
              properties={["image", "text"]}
              shape="square"
            />
          ))}
        </div>
      </div>
    </>
  );
}
