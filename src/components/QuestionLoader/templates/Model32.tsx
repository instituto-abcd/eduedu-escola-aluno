import {
  Box,
  Flex,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { ReadButton } from "~/components/ReadButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: boardW(24),
    h1: {
      fontSize: boardW(24),
      fontWeight: 600,
    },
  },
  centralizedText: {
    textAlign: 'center'
  }
}));

export function Model32({
  question,
  auxQuestion,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const { classes, cx } = useStyles();

  const {
    textTitles,
    imageTitles,
    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    optionArrKey,
  } = useQuestionHelper(question);

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
    setContinueDisabled(!answer);
  }, [answer]);

  return (
    <>
      {(hasAudioTitle || auxQuestion) && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={title.position}
              src={title.file_url ?? ""}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}

          {auxQuestion && <ReadButton question={auxQuestion} />}
        </Group>
      )}

      <Stack my="auto" w={boardW(800)}>
        <Title color="dark.3" size={boardW(24)} align="center">
          {
            textTitles.find(
              (title) =>
                title.classification === QuestionTitleClassification.INTRO
            )?.description
          }
        </Title>

        <Flex w="100%" gap={boardW(50)} m="auto">
          <Box w="100%" maw={boardW(400)}>
            <ScrollArea h={boardW(400)} type="always">
              <Stack pb={5}>
                {question?.planet_id && (
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: textTitles.filter(
                        (item) => item.placeholder != "ID da historinha"
                      )?.[0]?.description,
                    }}
                    className={cx(classes.typography, classes.centralizedText)}
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

                {imageTitles
                  .filter((title) => !!title.file_url)
                  .map((title) => (
                    <Image
                      src={title.file_url}
                      key={title.file_url}
                      width={boardW(300)}
                      m="auto"
                    />
                  ))}
              </Stack>
            </ScrollArea>
          </Box>
          <Box w="100%" maw={boardW(420)}>
            <ScrollArea h={boardW(420)}>
              <Stack my="auto">
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
                    key={optionArrKey(option, inx)}
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
                    sound={option.sound_url ?? undefined}
                    isCorrect={option.isCorrect}
                    style={{
                      // maxWidth: lousaWidth * 40 / 100,
                      // minWidth: "auto",
                      width: "100%",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      textAlign: "center",
                      fontSize: boardW(20),
                    }}
                  >
                    {option.description}
                  </TextOptionButton>
                ))}
              </Stack>
            </ScrollArea>
          </Box>
        </Flex>
      </Stack>
    </>
  );
}
