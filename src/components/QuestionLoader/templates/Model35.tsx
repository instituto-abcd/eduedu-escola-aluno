import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { lousaHeight } from "~/constants/dimensions";
import { ModelProps } from ".";
import { Group, Textarea, createStyles } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";

const useStyles = createStyles((theme) => ({
  textArea: {
    backgroundColor: theme.colors.gray[1],
    borderColor: theme.colors.gray[6],
    width: 418,
    height: 212,
  },
}));

export function Model35({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const { audioTitles, imageTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);
  const { classes } = useStyles();

  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    setAnswer("");
  }, [question]);

  useEffect(() => {
    onAnswerChange([
      {
        description: answer,
        positionAnswer: 0,
        position: 0,
      } as QuestionOption,
    ]);

    setContinueDisabled(!answer || answer === "");
  }, [answer]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url!}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </Group>
      )}

      <Group my="auto" spacing={10} align="center">
        {imageTitles[0] && (
          <>
            <img
              src={imageTitles[0].file_url!}
              width="auto"
              height={(lousaHeight * 40) / 100}
            />

            {imageTitles[0].file_url?.length
              ? ""
              : "Ooops! Imagem não disponível :("}
          </>
        )}
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          classNames={{ input: classes.textArea }}
        />
      </Group>
    </>
  );
}
