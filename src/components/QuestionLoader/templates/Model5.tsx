import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import { ImageTitle, TitleBubble } from "~/components/question-components";
import { VideoTitle } from "~/components/question-components/VideoTitle";
import { CardOption } from "~/components/question-components/card-option";
import { cx } from "~/utils/cx";
import { validString } from "~/utils/string";
import { TextTitle } from "~/components/question-components/TextTitle";
import { useMediaQuery } from "@mantine/hooks";

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
      validString(title.description) && !title.placeholder?.includes("ID")
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  return (
    <>
      {(hasAudioTitle || hasSupportText) && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      <div className="flex flex-col items-center justify-between size-full my-auto lg:flex-row py-2">
        {/* Titles */}
        <div className="my-auto flex flex-col items-center lg:justify-center lg:min-w-[50%] lg:h-full">
          {!hasVideo &&
            hasText &&
            regularTextTitles.map((title, inx) => (
              <TextTitle
                text={title.description}
                key={inx}
              />
            ))}

          <ImageTitle titles={imageTitles} />
          <VideoTitle titles={videoTitles} />
        </div>

        {/* Options */}
        <div
          className={cx(
            "size-full grow flex flex-col items-center justify-center max-h-[400px] ",
            {}
          )}
        >
          <GridContainer qtyItems={question.options.length}>
            {question.options.map((option, inx) => (
              <CardOption
                key={inx}
                onClick={() => handleOptionClick(option)}
                selected={getSelectedState(option)}
                option={option}
                properties={["image", "text"]}
                shape={
                  isSmallScreen
                    ? question.options.length > 4
                      ? "square"
                      : "contain"
                    : "contain"
                }
              />
            ))}
          </GridContainer>
        </div>
      </div>
    </>
  );
}

type GridContainerProps = React.HTMLProps<HTMLDivElement> & {
  qtyItems?: number;
};

function GridContainer({
  qtyItems = 4,
  className,
  ...props
}: GridContainerProps) {
  return (
    <div
      className={cx(
        "grid grid-cols-2 w-full h-auto justify-items-center items-center gap-3 max-h-[400px] py-2",
        "",
        {
          ["lg:aspect-square"]: qtyItems === 4,
          ["md:grid-cols-3 md:grid-rows-2"]: qtyItems > 4 && qtyItems <= 6,
        },
        className
      )}
      {...props}
    />
  );
}
