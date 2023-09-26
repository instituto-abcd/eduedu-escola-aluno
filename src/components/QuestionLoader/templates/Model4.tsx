import {
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetExamQuestion } from "~/api/student";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { lousaWidth } from "~/utils/userScreen";

const useStyles = createStyles(() => ({
  h1: {
    h1: {
      fontSize: '2.3vw',
    },
  },
}));

export function Model4({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { audioTitles, textTitles, imageTitles, optionArrKey, isExam } =
    useQuestionHelper(question);

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;

  function submitAnswer() {
    if (answer === null) return;

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
      {audioTitles.map((title) => (
        <AudioButton
          key={title.position}
          src={title.file_url ?? ""}
          autoPlay={!!title.file_url}
        />
      ))}
      <Stack my="auto" align="center">
        {textTitles.map((title) => (
          <Title
            color="dark.3"
            size="2.5vh"
            align="center"
            my="auto"
            maw={900}
            dangerouslySetInnerHTML={{ __html: title.description }}
            className={classes.h1}
            key={title.description}
          />
        ))}

        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.description}
            width={lousaWidth * 25 / 100}
            key={title.file_url}
          />
        ))}
        <Group justify="center">
          {question.options.map((option, inx) => (
            <OptionButton
              key={optionArrKey(option, inx)}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              onClick={() => setAnswer(option)}
              sound={option.sound_url ?? undefined}
              isCorrect={option.isCorrect}
            >
              {option.image_url && (
                <>
                  <img
                    src={option.image_url}
                    alt={option.description}
                    height={105}
                    width="auto"
                    style={{
                      maxHeight: 120,
                      maxWidth: "100%",
                      objectFit: "contain",
                      marginInline: "auto",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                  {!question.axis_code && question.axis_code === null && (
                    <Text size={14} color="gray.7" weight={600}>
                      {option.description}
                    </Text>
                  )}
                </>
              )}
              {!option.image_url && <Text>{option.description}</Text>}
            </OptionButton>
          ))}
        </Group>
      </Stack>
      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
