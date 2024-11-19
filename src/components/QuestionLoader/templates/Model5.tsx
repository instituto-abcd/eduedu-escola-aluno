import { createStyles } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import { ImageTitle, TitleBubble } from "~/components/question-components";
import { VideoTitle } from "~/components/question-components/VideoTitle";
import { cx } from "~/utils/cx";

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
  const { classes } = useStyles();

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
    <div className="w-full grow flex flex-col items-center justify-evenly gap-5">
      {(hasAudioTitle || hasSupportText) && (
        <AudioContainer question={question}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-fit lg:min-w-[50%]">
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

        <div className="grid grid-cols-2 gap-6 place-content-center lg:min-w-[50%]">
          {question.options.map((option, inx) =>
            option.image_url ? (
              <OptionButton
                key={inx}
                onClick={() => handleOptionClick(option)}
                data-selected={getSelectedState(option)}
                option={option}
              >
                <img
                  src={option.image_url}
                  alt={option.description}
                  className={cx("max-h-[90%] max-w-[90%] h-full w-auto", {
                    ["max-h-[60%]"]:
                      typeof option.description === "string" &&
                      option.description !== "",
                  })}
                />
                {option.description}
              </OptionButton>
            ) : (
              <TextOptionButton
                key={inx}
                onClick={() => handleOptionClick(option)}
                data-selected={getSelectedState(option)}
                className={classes.textOption}
                option={option}
                debug={{ size: 8 }}
              >
                {option.description}
              </TextOptionButton>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const useStyles = createStyles(() => ({
  textOption: {
    width: "100%",
    height: "min-content",
    paddingBlock: 16,
    paddingInline: 26,
    fontSize: 20,
  },
}));
