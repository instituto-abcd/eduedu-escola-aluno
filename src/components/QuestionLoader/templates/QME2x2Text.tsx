import {
  Group,
  Image,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
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
      <Title color="dark.3" size="2.5vh">{title}</Title>

      <Group noWrap grow spacing={75}>
        <ScrollArea h={380}>
          <Stack align="center" p={20}>
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

        <Stack align="center" p={20}>
          <Title align="center" color="dark.3" size={30} weight={500}>
            {
              textTitles.find(
                (title) =>
                  title.classification === QuestionTitleClassification.ENUNCIADO
              )?.description
            }
          </Title>
          <Group align="center" position="center">
            <Stack align="strech">
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
      </Group>

      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
