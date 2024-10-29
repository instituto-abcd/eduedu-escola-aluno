import { Group, SimpleGrid, Stack, Title, createStyles } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import { BREAKPOINT } from "~/constants/dimensions";
import { ImageTitle } from "~/components/question-components";
import { VideoTitle } from "~/components/question-components/VideoTitle";

export function Model5({
  question,
  onAnswerChange,
  onConditionsChange,
  auxQuestion,
}: ModelProps) {
  const {
    audioTitles,
    videoTitles,
    textTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    supportText,
  } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const [multipleAnswer, setMultipleAnswer] = useState<QuestionOption[]>([]);
  const { classes } = useStyles();

  function handleOptionClick(option: QuestionOption) {
    if (question.multiplesAnswer) {
      if (multipleAnswer.includes(option)) {
        setMultipleAnswer(
          multipleAnswer.filter(
            (opt) => JSON.stringify(opt) !== JSON.stringify(option),
          ),
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
    (title) => !title.placeholder?.startsWith("ID"),
  );
  const hasImage = imageTitles.some((title) => title.file_url);
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
    [answer, multipleAnswer],
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <div className={classes.container}>
      {hasAudioTitle ||
        (hasSupportText && (
          <AudioContainer question={question} audioTitles={audioTitles}>
            {auxQuestion && <ReadButton question={auxQuestion} />}
          </AudioContainer>
        ))}

      <div className={classes.content}>
        {!hasVideo && hasText && (
          <div className={classes.textBubble}>
            <Title
              color="dark.3"
              align="center"
              my="auto"
              maw={400}
              dangerouslySetInnerHTML={{
                __html:
                  textTitles.find(
                    (title) =>
                      !title.placeholder?.startsWith("ID") ||
                      !title.placeholder?.includes("ID"),
                  )?.description ?? "",
              }}
              className={classes.title}
            />
          </div>
        )}

        <ImageTitle titles={imageTitles} />

        <VideoTitle titles={videoTitles} />
      </div>
      <SimpleGrid
        cols={question.options.some((op) => !!op.image_url) ? 2 : 1}
        className={classes.grid}
      >
        {question.options.map((option, inx) =>
          option.image_url ? (
            <OptionButton
              key={inx}
              onClick={() => handleOptionClick(option)}
              data-selected={getSelectedState(option)}
              option={option}
              className={classes.option}
            >
              <img src={option.image_url} alt={option.description} />
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
          ),
        )}
      </SimpleGrid>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  option: {
    width: 140,
    height: 140,

    img: {
      maxWidth: 100,
      maxHeight: 100,
      objectFit: "contain",
    },
  },

  textOption: {
    width: "100%",
    height: "min-content",
    paddingBlock: 16,
    paddingInline: 26,
    fontSize: 20,
  },

  title: {
    fontSize: 26,
  },

  container: {
    height: "100%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 20,
  },

  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 25,
    [theme.fn.largerThan(BREAKPOINT.TABLET_HORZ)]: {
      flexDirection: "row",
    },
  },

  grid: {
    placeItems: "center",
  },

  textBubble: {
    backgroundColor: "white",
    borderRadius: 45,
    padding: 30,
    dislay: "flex",
    flexDirection: "column",
    gap: 30,
    maxHeight: 250,
    overflowY: "scroll",
  },
}));
