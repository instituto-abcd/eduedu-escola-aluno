import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { Group, LoadingOverlay, Textarea, createStyles } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { usePlanetAnswer } from "~/api/planet";
import { EduButton } from "~/components/EduButton";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";

const useStyles = createStyles((theme) => ({
  textArea: {
    backgroundColor: theme.colors.gray[1],
    borderColor: theme.colors.gray[6],
    width: 418,
    height: 212,
  },
}));

export function Model35({ question, answerCallback }: ModelProps) {
  const { audioTitles, imageTitles } = useQuestionHelper(question);
  const { classes } = useStyles();

  const [answer, setAnswer] = useState<string>("");
  const disabled = !answer;

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (disabled) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [
        {
          description: answer,
          positionAnswer: 0,
          position: 0,
        } as QuestionOption,
      ],
    });
  }

  useEffect(() => {
    setAnswer("");
  }, [question]);

  return (
    <>
      {audioTitles.some((title) => title.file_url) && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                src={title.file_url!}
                key={inx}
                autoPlay={inx === 0}
              />
            ))}
        </Group>
      )}

      <Group my="auto" spacing={60} align="center">
        {imageTitles[0] && (
          <img
            src={imageTitles[0].file_url!}
            width={260}
            style={{ maxHeight: 300 }}
          />
        )}
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          classNames={{ input: classes.textArea }}
        />
      </Group>

      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
