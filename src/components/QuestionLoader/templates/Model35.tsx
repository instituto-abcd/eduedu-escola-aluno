// Aux & Utils:
import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { usePlanetAnswer } from "~/api/planet";
import { QuestionOption } from "~/api/exam";
import { lousaHeight } from "~/constants/dimensions";
import { ModelProps } from ".";

// Components:
import { Group, LoadingOverlay, Textarea, createStyles } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";

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
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles.some((title) => title.file_url) && (
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
      <Group my="auto" spacing={10} align="center">
        {imageTitles[0] && (
          <>
            <img
              src={imageTitles[0].file_url!}
              width="auto"
              height={lousaHeight * 40 / 100}
            />

            {imageTitles[0].file_url?.length ? '' : "Ooops! Imagem não disponível :("}
          </>
        )}
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          classNames={{ input: classes.textArea }}
        />
      </Group>

      {/* Continue to the next screen button */}
      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
