import {
  Flex,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { ReadButton } from "~/components/ReadButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { IconMessageCircle2 } from "@tabler/icons-react";

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

  const {
    textTitles,
    imageTitles,
    audioTitles,
    hasAudioTitle,
    hasImageTitle,
    getRule,
  } = useQuestionHelper(question);

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

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxAudioRef = useRef<AudioButtonRef>(null);
  const autoplay = getRule("autoplay")?.value === "false" ? false : true;

  useLayoutEffect(() => {
    if (mainAudioRef.current && auxAudioRef.current) {
      mainAudioRef.current.sound.onEnd(() => {
        auxAudioRef.current!.sound.play();
      });
    }

    return () => {
      auxAudioRef.current?.sound.destroy();
    };
  }, [question]);

  return (
    <>
      {(hasAudioTitle || auxQuestion) && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => {
            const props = {
              ref: inx === 0 ? mainAudioRef : auxAudioRef,
              autoPlay: inx === 0 ? autoplay : false,
              icon: inx > 0 ? <IconMessageCircle2 size={30} /> : undefined,
              variant: inx > 0 ? "yellow" : "gray",
            } as const;

            return (
              <AudioButton key={inx} src={title.file_url ?? ""} {...props} />
            );
          })}

          {auxQuestion && <ReadButton question={auxQuestion} />}
        </Group>
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
