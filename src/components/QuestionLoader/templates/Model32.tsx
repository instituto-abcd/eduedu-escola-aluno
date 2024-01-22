import { Flex, Image, ScrollArea, Stack, Text, Title, createStyles } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";
import { ReadButton } from "~/components/ReadButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";

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
    overflow: 'auto',
  }
}));

export function Model32({
  question,
  auxQuestion,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { classes } = useStyles();
  const { textTitles, imageTitles, audioTitles, hasAudioTitle, hasImageTitle } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

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
      {(hasAudioTitle || auxQuestion) && (
        <AudioContainer question={question} audioTitles={audioTitles}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      <Stack my="auto" w={boardW(800)} justify="center">
        <Title color="dark.3" size={boardW(24)} align="center">
          {
            textTitles.find(
              (title) =>
                title.classification === QuestionTitleClassification.INTRO
            )?.description
          }
        </Title>

        <Flex
          w="100%"
          justify={textTitles.length > 0 ? "space-between" : "center"}
          align="center"
        >

          <ScrollArea mah={boardW(400)} w="48%" pr={20} className={classes.scroll} type="always">
            {hasImageTitle && imageTitles.map((title) => (
              <Image
                src={title.file_url}
                key={title.file_url}
                width={boardW(300)}
                m="auto"
              />
            ))}

            {textTitles.length > 0 && (
              <Stack pb={5}>
                {question?.planet_id && (
                  <Text
                    dangerouslySetInnerHTML={{
                      __html:
                        textTitles.find(
                          (title) =>
                            title.placeholder?.includes("Campo") ||
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
                            title.placeholder?.includes("Enunciado") ||
                            title.placeholder?.includes("Quem disse")
                        )?.description ?? "",
                    }}
                    className={classes.typography}
                  />
                )}
              </Stack>
            )}
          </ScrollArea>

          <ScrollArea mah={boardW(420)} w="48%" pr={20} className={classes.scroll} type="always">
            <Stack pb={5}>
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
                >
                  {option.description}
                </TextOptionButton>
              ))}
            </Stack>
          </ScrollArea>
        </Flex>
      </Stack>
    </>
  );
}
