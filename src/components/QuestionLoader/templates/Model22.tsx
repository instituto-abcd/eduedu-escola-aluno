import { Group, Stack, Title, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { QuestionOption } from "~/api/exam";
import { useEffect, useState } from "react";
import { boardW } from "~/constants/dimensions";

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

export function Model22({ question, onAnswerChange }: ModelProps) {
  const { audioTitles, audioTitleAutoplay, textTitles } =
    useQuestionHelper(question);
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

  useEffect(() => {
    setAnswer(undefined);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  return (
    <>
      <Group mx="auto" h="50px">
        {hasAudio &&
          audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                src={title.file_url!}
                key={inx}
                autoPlay={audioTitleAutoplay(inx)}
              />
            ))}
      </Group>

      <Stack align="center" spacing={boardW(50)} my="auto">
        {hasText && (
          <Title
            dangerouslySetInnerHTML={{
              __html: textTitles[0].description,
            }}
            color="dark.3"
            size={boardW(40)}
          />
        )}
        <Group align="center" className={classes.group} position="center">
          {question.options.map((option, inx) => (
            <TextOptionButton
              key={inx}
              onClick={() => handleAnswer(option)}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              style={{
                fontSize: boardW(25),
              }}
            >
              {option.description}
            </TextOptionButton>
          ))}
        </Group>
      </Stack>
    </>
  );
}
