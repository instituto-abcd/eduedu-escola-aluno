import { Group, LoadingOverlay, Stack, Title, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { QuestionOption } from "~/api/exam";
import { useEffect, useState } from "react";
import { EduButton } from "~/components/EduButton";
import { usePlanetAnswer } from "~/api/planet";
import { boardW, lousaHeight } from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  group: {
    backgroundColor: theme.colors.gray[1],
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[6],
    paddingInline: 45,
    paddingBlock: 25,
    maxWidth: boardW(800),
  },
}));

export function Model22({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles } = useQuestionHelper(question);
  const hasAudio = audioTitles.some((title) => title.file_url);
  const hasText = textTitles.some((title) => title.description);
  const { classes } = useStyles();

  const [answer, setAnswer] = useState<QuestionOption>();

  function handleAnswer(option: QuestionOption) {
    if (JSON.stringify(answer) === JSON.stringify(option)) {
      setAnswer(undefined);
    } else {
      setAnswer(option);
    }
  }

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [answer],
    });
  }

  useEffect(() => {
    setAnswer(undefined);
  }, [question]);

  return (
    <>
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {hasAudio && (
          audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                src={title.file_url!}
                key={inx}
                autoPlay={inx === 0}
              />
            ))
        )}
      </Group>

      {/* Board content */}
      <Stack align="center" spacing={boardW(50)}>
        {hasText &&
          <Title
            dangerouslySetInnerHTML={{
              __html: textTitles[0].description,
            }}
            color="dark.3"
            size={boardW(40)}
          />
        }
        <Group
          align="center"
          className={classes.group}
          position="center"
        >
          {question.options.map((option, inx) => (
            <TextOptionButton
              key={inx}
              onClick={() => handleAnswer(option)}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              style={{
                fontSize: boardW(25)
              }}
            >
              {option.description}
            </TextOptionButton>
          ))}
        </Group>
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
