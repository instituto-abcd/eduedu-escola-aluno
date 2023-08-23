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
import { Answer, useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { QuestionTitleClassification } from "~/api/exam";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: 20,
    h1: {
      fontSize: 30,
      fontWeight: 600,
    },
  },
}));

export function Model32({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();

  const { textTitles, imageTitles, audioTitles, optionArrKey } =
    useQuestionHelper(question);

  const [answer, setAnswer] = useState<Answer | null>(null);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [{ position: answer.position, positionAnswer: 0 }],
    });
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton
          key={title.position}
          src={title.file_url ?? ""}
          autoPlay={!!title.file_url}
        />
      ))}

      <Title color="dark.3" size={30} align="center">
        {
          textTitles.find(
            (title) =>
              title.classification === QuestionTitleClassification.INTRO
          )?.description
        }
      </Title>

      <Group noWrap grow spacing={50}>
        <ScrollArea h={290} px={30} type="always">
          <Stack align="stretch" spacing={20} py={10}>
            <Text
              dangerouslySetInnerHTML={{
                __html:
                  textTitles.find(
                    (title) =>
                      title.classification ===
                      QuestionTitleClassification.HISTORIA
                  )?.description ?? "",
              }}
              className={classes.typography}
            />
            {imageTitles.map((title) => (
              <Image
                src={title.file_url}
                key={title.file_url}
                width={204}
                mx="auto"
              />
            ))}
          </Stack>
        </ScrollArea>
        <Stack>
          <Text size={20} weight={600} color="dark.3" align="center">
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
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
              data-selected={answer?.position === option.position}
              sound={option.sound_url ?? undefined}
              isCorrect={option.isCorrect}
            >
              {option.description}
            </TextOptionButton>
          ))}
        </Stack>
      </Group>
      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
