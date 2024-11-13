import {
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";
import { ReadButton } from "~/components/ReadButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { FloatingButton } from "~/components/FloatingButton";
import { useEnunciationScrollIndicator } from "~/hooks/useEnunciationScrollIndicator";
import { TEXT_PLACEHOLDERS } from "~/constants/text-placeholders";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: boardW(24),
    h1: {
      fontSize: boardW(24),
      fontWeight: 600,
    },
    textAlign: "center",
  },
  scroll: {
    overflow: "auto",

    "::-webkit-scrollbar": {
      width: 5,
    },

    "::-webkit-scrollbar-track": {
      borderRadius: 15,
      background: "#f3f2f2ae",
    },

    "::-webkit-scrollbar-thumb": {
      borderRadius: 15,
      background: "#CCC",
    },
  },
}));

export function Model32({
  question,
  auxQuestion,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { classes } = useStyles();
  const {
    textTitles,
    imageTitles,
    hasAudioTitle,
    hasImageTitle,
    hasTextTitle,
  } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { enunciationScrollRef, enunciationScrollIndicator } =
    useEnunciationScrollIndicator(question);

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
      <div className="md:min-h-14 md:self-start">
        {(hasAudioTitle || auxQuestion) && (
          <AudioContainer question={question}>
            {auxQuestion && <ReadButton question={auxQuestion} />}
          </AudioContainer>
        )}
      </div>

      <div className="w-full md:w-5/6 my-auto">
        <Title
          color="dark.3"
          size={boardW(24)}
          align="center"
        >
          {
            textTitles.find(
              (title) =>
                title.classification === QuestionTitleClassification.INTRO
            )?.description
          }
        </Title>

        <div className="h-auto md:min-h-[370px] gap-4 w-auto flex flex-col md:flex-row justify-around items-center">
          {(hasImageTitle || hasTextTitle) && (
            <div className="w-full flex justify-center items-center">
              <ScrollArea
                mah={boardW(400)}
                w="100%"
                pr={20}
                className={`${classes.scroll} flex flex-col items-center justify-center text-center`}
                type="always"
                ref={enunciationScrollRef}
              >
                {enunciationScrollIndicator && <FloatingButton />}
                {hasImageTitle &&
                  imageTitles.map((title) => (
                    <Image
                      src={title.file_url}
                      key={title.file_url}
                      width={boardW(300)}
                      m="auto"
                    />
                  ))}
                {textTitles.length > 0 && (
                  <Stack
                    pb={5}
                    px={4}
                    mt={5}
                  >
                    {question?.planet_id && (
                      <Text
                        dangerouslySetInnerHTML={{
                          __html:
                            textTitles.find(
                              (title) =>
                                title.placeholder?.includes(
                                  TEXT_PLACEHOLDERS.CAMPO
                                ) ||
                                (!title.placeholder && title.description)
                            )?.description ?? "",
                        }}
                        className={classes.typography}
                      />
                    )}
                    {!question?.planet_id && (
                      <Text
                        dangerouslySetInnerHTML={{
                          __html:
                            textTitles.find(
                              (title) =>
                                title.classification ===
                                QuestionTitleClassification.HISTORIA
                            )?.description ??
                            textTitles[0]?.description ??
                            "",
                        }}
                        className={classes.typography}
                      />
                    )}
                    {question?.planet_id && (
                      <Text
                        dangerouslySetInnerHTML={{
                          __html:
                            textTitles.find(
                              (title) =>
                                title.placeholder?.includes(
                                  TEXT_PLACEHOLDERS.ENUNCIADO
                                ) ||
                                title.placeholder?.includes(
                                  TEXT_PLACEHOLDERS.QUEM_DISSE
                                )
                            )?.description ?? "",
                        }}
                        className={classes.typography}
                      />
                    )}
                  </Stack>
                )}
              </ScrollArea>
            </div>
          )}

          <ScrollArea
            mah={boardW(470)}
            w="90%"
            pr={20}
            className={classes.scroll}
            type="always"
          >
            <Stack
              pb={5}
              className="w-full"
            >
              <Text
                size={boardW(20)}
                weight={600}
                color="dark.3"
                align="center"
              >
                {
                  textTitles.find(
                    (title) =>
                      title.classification ===
                      QuestionTitleClassification.ENUNCIADO
                  )?.description
                }
              </Text>
              {question.options.map((option, inx) => (
                <TextOptionButton
                  key={inx}
                  onClick={() =>
                    setAnswer({
                      ...option,
                      positionAnswer: question.orderedAnswer
                        ? option.position
                        : undefined,
                    } as QuestionOption)
                  }
                  data-selected={
                    JSON.stringify(answer) === JSON.stringify(option)
                  }
                  option={option}
                  style={{
                    width: "100%",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    textAlign: "center",
                    fontSize: boardW(20),
                  }}
                  debug={{ size: 10 }}
                  className="h-10"
                >
                  {option.description}
                </TextOptionButton>
              ))}
            </Stack>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
