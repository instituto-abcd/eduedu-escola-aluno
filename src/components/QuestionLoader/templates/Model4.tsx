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
import { Answer, useGetExamQuestion } from "~/api/student";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton";

const useStyles = createStyles(() => ({
  h1: {
    h1: {
      fontSize: 40,
    },
  },
}));

export function Model4({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const { audioTitles, textTitles, imageTitles } = useQuestionHelper(question);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (answer === null) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [answer],
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
      <Stack my="auto" align="center">
        {textTitles.map((title) => (
          <Title
            color="dark.3"
            size={20}
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
            width={270}
            key={title.file_url}
          />
        ))}
        <Group spacing={24}>
          {question.options.map((option) => (
            <OptionButton
              key={option.position}
              data-selected={answer?.position === option.position}
              onClick={() =>
                setAnswer({
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
              sound={option.sound_url ?? undefined}
            >
              {option.image_url && (
                <>
                  <Image
                    src={option.image_url}
                    alt={option.description}
                    height={105}
                    width="auto"
                    styles={{ image: { maxWidth: "100%" } }}
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
