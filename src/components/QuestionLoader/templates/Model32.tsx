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
import { useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight, lousaWidth } from "~/utils/userScreen";

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

  const { textTitles, imageTitles, audioTitles, optionArrKey, isExam } =
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

  return (
    <>
      {audioTitles
        .filter((title) => !!title.file_url)
        .map((title) => (
          <AudioButton
            key={title.position}
            src={title.file_url ?? ""}
            autoPlay={!!title.file_url}
          />
        ))}

      <Title color="dark.3" size="2.5vh" align="center">
        {
          textTitles.find(
            (title) =>
              title.classification === QuestionTitleClassification.INTRO
          )?.description
        }
      </Title>

      <Group noWrap grow spacing={50} my="auto">
        <ScrollArea h={lousaHeight * 60 / 100} px={30} type="always">
          <Stack align="stretch" spacing={20} py={10}>
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
            {imageTitles
              .filter((title) => !!title.file_url)
              .map((title) => (
                <Image
                  src={title.file_url}
                  key={title.file_url}
                  width={204}
                  mx="auto"
                />
              ))}
          </Stack>
        </ScrollArea>

        <ScrollArea h={lousaHeight * 60 / 100} px={30} type="always">
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
                  maxWidth: lousaWidth * 40 / 100,
                  width: '100%',
                  minWidth: "auto",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                {option.description}
              </TextOptionButton>
            ))}
          </Stack>
        </ScrollArea>
      </Group>
      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
