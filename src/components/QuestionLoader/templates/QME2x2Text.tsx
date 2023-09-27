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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { lousaPaddingTop, lousaWidth, scrollAreaHeight, scrollAreaWidth } from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: 20,
    textAlign: "center",
    b: {
      fontWeight: 500,
      fontSize: 30,
    },
  },
  button: {
    width: "100%",
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
      <Stack
        my="auto"
        pt={lousaPaddingTop}
      >
        <Title color="dark.3" size="2.5vh" mx="auto">{title}</Title>

        <Group mx="auto">
          <Box maw={lousaWidth * 50 / 100}>
            <ScrollArea
              mah={scrollAreaHeight * 80 / 100}
              maw={scrollAreaWidth * 80 / 100}
            >
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
                    width={102}
                    key={title.file_url}
                  />
                ))}
              </Stack>
            </ScrollArea>
          </Box>

          <Box maw={lousaWidth * 50 / 100}>
            <ScrollArea
              mah={scrollAreaHeight * 80 / 100}
              maw={scrollAreaWidth * 90 / 100}
            >
              <Stack align="center">
                <Title align="center" color="dark.3" size="2.5vh" weight={500}>
                  {
                    textTitles.find(
                      (title) =>
                        title.classification === QuestionTitleClassification.ENUNCIADO
                    )?.description
                  }
                </Title>
                <Group align="center" position="center">
                  <Stack align="strech" style={{ marginBottom: "5px" }}>
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
        </Group>
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: "auto",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
