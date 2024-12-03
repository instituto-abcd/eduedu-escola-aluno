import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import { ImageTitle, TitleBubble } from "~/components/question-components";
import { VideoTitle } from "~/components/question-components/VideoTitle";
import { CardOption } from "~/components/question-components/card-option";
import { useMediaQuery } from "@mantine/hooks";
import { cx } from "~/utils/cx";
import { validString } from "~/utils/string";

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

  // Usado para extrair os títulos de texto verdadeiros
  // uma vez que ID de questão auxiliar aparece como title type text
  const regularTextTitles = textTitles.filter(
    (title) =>
      validString(title.description) && !title.placeholder.includes("ID")
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
        <div className="size-full flex flex-col items-center lg:justify-center lg:min-w-[50%] lg:h-full">
          {!hasVideo &&
            hasText &&
            regularTextTitles.map((title, inx) => (
              <TitleBubble
                text={title.description}
                key={inx}
              />
            ))}

          <ImageTitle titles={imageTitles} />
          <VideoTitle titles={videoTitles} />
        </div>

        {/* Options */}
        <div className="size-full grow flex flex-col items-center justify-center">
          <GridContainer rows={question.options.length / 2}>
            {question.options.map((option, inx) => (
              <CardOption
                key={inx}
                onClick={() => handleOptionClick(option)}
                selected={getSelectedState(option)}
                option={option}
                properties={["image", "text"]}
                shape="contain"
              />
            ))}
          </GridContainer>
        </div>
      </div>
    </>
  );
}

type GridContainerProps = React.HTMLProps<HTMLDivElement> & {
  rows?: number;
};

function GridContainer({ rows = 2, className, ...props }: GridContainerProps) {
  return (
    <div
      className={cx(
        "grid grid-cols-2 w-full h-auto max-h-[400px] justify-items-center items-center gap-3",
        {
          ["aspect-square"]: rows % 2 === 0,
        },
        className
      )}
      {...props}
    />
  );
}
