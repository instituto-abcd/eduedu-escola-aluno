import {
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { boardW, BREAKPOINT } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { FloatingButton } from "~/components/FloatingButton";
import { useEnunciationScrollIndicator } from "~/hooks/useEnunciationScrollIndicator";
import { TEXT_PLACEHOLDERS } from "~/constants/text-placeholders";
import { TextOptionButton } from "~/components/OptionButton";

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

  const [maxHeightScroll, setMaxHeightScroll] = useState(650);

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

  useLayoutEffect(() => {
    const getMaxHeightScroll = (width: number): number => {
      if (width >= BREAKPOINT.DESKTOP) return 500;
      if (width >= BREAKPOINT.TABLET_HORZ) return 550;
      if (width >= BREAKPOINT.TABLET_VERT) return 500;
      return 200;
    };

    setMaxHeightScroll(getMaxHeightScroll(window.innerWidth));
  }, []);

  return (
    <>
      <div className="md:min-h-14 md:self-start">
        {(hasAudioTitle || auxQuestion) && (
          <AudioContainer question={question}>
            {auxQuestion && <ReadButton question={auxQuestion} />}
          </AudioContainer>
        )}
      </div>

      <div className="w-full my-auto">
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
                mah={boardW(700)}
                w="100%"
                pr={20}
                className={`${classes.scroll} flex flex-col items-center justify-center text-center`}
                type="auto"
                ref={enunciationScrollRef}
              >
                {enunciationScrollIndicator && <FloatingButton />}
                {hasImageTitle &&
                  imageTitles.map((title) => (
                    <Image
                      src={title.file_url}
                      key={title.file_url}
                      width={'auto'}
                      style={{
                        maxWidth: boardW(550)
                      }}
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
                        className={`${classes.typography} text-[3cqw] lg:text-2xl`}
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
                        className={`${classes.typography} text-[5cqw] md:text-[3cqw]`}
                      />
                    )}
                  </Stack>
                )}
              </ScrollArea>
            </div>
          )}

          <ScrollArea
            mah={maxHeightScroll}
            w="90%"
            pr={20}
            className={classes.scroll}
            type="always"
          >
            <Stack
              pb={10}
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
                  aspectSquare={false}
                  fullHeight={false}
                  classHeight="h-auto min-h-14"
                  style={{
                    width: "100%",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    textAlign: "center",
                  }}
                  debug={{ size: 10 }}
                  className="max-h-36 w-full p-1 text-2xl"
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
