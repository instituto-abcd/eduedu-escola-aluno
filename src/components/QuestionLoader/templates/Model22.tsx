import { Group, Stack, Title, Image, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { QuestionOption } from "~/api/exam";
import { useEffect, useMemo, useState } from "react";
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
  title: {
    fontSize: boardW(30),
  },
}));

export function Model22({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles, audioTitleAutoplay, textTitles, imageTitles } =
    useQuestionHelper(question);
  const hasAudio = audioTitles.some((title) => title.file_url);

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

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

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

      <Stack align="center" spacing={boardW(20)} my="auto">
        {textTitles.map((title) => (
          <Title
            key={title.description}
            dangerouslySetInnerHTML={{ __html: title.description }}
            align="center"
            color="dark.3"
            className={classes.title}
          />
        ))}
        {imageTitles.map((title) => (
          <Image
            mx="auto"
            src={title.file_url}
            alt={title.description}
            height={boardW(200)}
            width="auto"
            key={title.file_url}
            style={{ flexGrow: 1 }}
            styles={{ image: { marginInline: "auto" } }}
          />
        ))}
        <Group align="center" className={classes.group} position="center">
          {question.options.map((option, inx) => (
            <TextOptionButton
              key={inx}
              onClick={() => handleAnswer(option)}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              style={{
                fontSize: boardW(24),
              }}
              option={option}
              debug={{ size: 10 }}
            >
              {option.description}
            </TextOptionButton>
          ))}
        </Group>
      </Stack>
    </>
  );
}
