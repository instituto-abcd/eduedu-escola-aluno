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
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
  boardW,
  lousaHeight
} from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: boardW(24),
    textAlign: "center",
    b: {
      fontWeight: 500,
      fontSize: boardW(26),
    },
  },
  button: {
    width: "100%",
    height: "fit-content",
    padding: boardW(20),
  },
}));

export function QME2x2Text({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();
  const { textTitles, imageTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (answer === null) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [answer] as QuestionOption[],
    });
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const title = "Leia o texto e responda à pergunta.";
  return (
    <>
      {/* Board content */}
      <Stack my="auto" w={boardW(800)}>
        <Title color="dark.3" size={boardW(24)} mx="auto" pb={boardW(15)}>
          {title}
        </Title>

        <Flex w="100%" gap={boardW(10)} m="auto">
          <Box w="100%" maw={boardW(440)}>
            <ScrollArea w="100%" h={boardW(450)} pr={boardW(30)} type="always">
              <Stack align="center">
                <Text
                  className={classes.typography}
                  dangerouslySetInnerHTML={{
                    __html:
                      textTitles.find(
                        (title) =>
                          title.classification ===
                          QuestionTitleClassification.HISTORIA
                      )?.description ?? "",
                  }}
                />
                {imageTitles.map((title) => (
                  <Image
                    src={title.file_url}
                    alt={title.file_name}
                    height={boardW(120)}
                    width="auto"
                    pt={boardW(20)}
                    key={title.file_url}
                  />
                ))}
              </Stack>
            </ScrollArea>
          </Box>

          <Box w="100%" maw={boardW(400)}>
            <ScrollArea w="100%" h={boardW(450)} type="always">
              <Stack align="center">
                <Title align="center" color="dark.3" size={boardW(26)} weight={500}>
                  {
                    textTitles.find(
                      (title) =>
                        title.classification ===
                        QuestionTitleClassification.ENUNCIADO
                    )?.description
                  }
                </Title>
                <Group align="center" position="center">
                  <Stack align="strech" style={{ marginBottom: "5px" }} w="100%">
                    {question.options.map((option) => (
                      <TextOptionButton
                        key={option.description}
                        onClick={() => setAnswer(option)}
                        data-selected={answer?.position === option.position}
                        className={classes.button}
                      >
                        {option.description}
                      </TextOptionButton>
                    ))}
                  </Stack>
                </Group>
              </Stack>
            </ScrollArea>
          </Box>
        </Flex>
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: "auto"
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
