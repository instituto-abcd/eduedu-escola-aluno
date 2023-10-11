import {
  Group,
  Image,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  Box,
  Title,
  createStyles,
  Flex,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { usePlanetAnswer, usePlanetGetQuestion } from "~/api/planet";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { ReadButton } from "~/components/ReadButton";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: boardW(24),
    h1: {
      fontSize: boardW(24),
      fontWeight: 600,
    },
  },
}));

export function Model32({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();

  const { textTitles, imageTitles, audioTitles, supportText, optionArrKey, isExam } =
    useQuestionHelper(question);

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;

  function submitAnswer() {
    if (!answer) return;

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: [answer],
      });
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: [answer],
      });
    }
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const { data: readText } = usePlanetGetQuestion(
    question.planet_id,
    supportText[0]?.["description"] ?? "",
    {
      enabled: !!supportText[0]?.["description"],
    }
  );

  return (
    <>
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles
          .filter((title) => !!title.file_url)
          .map((title) => (
            <AudioButton
              key={title.position}
              src={title.file_url ?? ""}
              autoPlay={!!title.file_url}
            />
          ))}

        {readText && <ReadButton question={readText} />}
      </Group>

      {/* Board content */}
      <Stack my="auto" w={boardW(800)}>
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

        <Flex w="100%" gap={boardW(50)} m="auto">
          <Box w="100%" maw={boardW(400)}>
            <ScrollArea h={boardW(400)} type="always">
              <Stack pb={5}>
                {question?.planet_id &&
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: textTitles.filter((item) => item.placeholder != 'ID da historinha')?.[0]?.description,
                    }}
                    className={classes.typography}
                  />
                }
                {!question?.planet_id &&
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
                }

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
                        title.classification === QuestionTitleClassification.ENUNCIADO
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
                    data-selected={JSON.stringify(answer) === JSON.stringify(option)}
                    sound={option.sound_url ?? undefined}
                    isCorrect={option.isCorrect}
                    style={{
                      // maxWidth: lousaWidth * 40 / 100,
                      // minWidth: "auto",
                      width: '100%',
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      textAlign: "center",
                      fontSize: boardW(20)
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

      {/* Continue to the next screen button */}
      <EduButton disabled={!answer} onClick={submitAnswer} style={{ marginTop: "auto" }}>
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
