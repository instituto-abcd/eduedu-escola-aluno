// Utils & Aux:
import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useGetExamQuestion } from "~/api/student";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { lousaWidth, lousaPaddingTop, lousaHeight } from "~/constants/dimensions";
import { ModelProps } from ".";

// Components:
import {
  Image,
  LoadingOverlay,
  Group,
  Text,
  Title,
  Stack,
  Center,
  createStyles,
} from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { EduButton } from "~/components/EduButton";

const useStyles = createStyles(() => ({
  h1: {
    h1: {
      fontSize: '2.2vw',
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
      {/* Action buttons */}
      <Group mx="auto">
        {audioTitles.map((title) => (
          <AudioButton
            key={title.position}
            src={title.file_url ?? ""}
            autoPlay={!!title.file_url}
          />
        ))}
      </Group>

      {/* Board content */}
      <Stack
        my="auto"
        pt={lousaPaddingTop}
        spacing={(lousaWidth * 5 / 100)}
      >
        {textTitles.map((title) => (
          <Title
            key={title.description}
            dangerouslySetInnerHTML={{ __html: title.description }}
            align="center"
            color="dark.3"
            className={classes.h1}
          />
        ))}

        {imageTitles.map((title) => (
          <Image
            mx="auto"
            src={title.file_url}
            alt={title.description}
            width={lousaWidth * 25 / 100}
            key={title.file_url}
          />
        ))}

        <Center>
          <Group>
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
        </Center>
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
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
