import {
  Center,
  Group,
  Image,
  Stack,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { TextOptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  button: {
    wordBreak: "keep-all",
    width: "100%",
    height: "fit-content",
    padding: boardW(20),
  },
});

export function Model8({ question, onAnswerChange }: ModelProps) {
  const { imageTitles, videoTitles, textTitles, audioTitles } =
    useQuestionHelper(question);

  const { classes } = useStyles();

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {audioTitles.some((title) => title.file_url !== null) && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              src={title.file_url ?? ""}
              autoPlay={inx === 0}
            />
          ))}
        </Group>
      )}

      <Group my="auto" align="center" position="center" noWrap>
        {textTitles.map((title, inx) => (
          <Title
            color="dark.3"
            size="2.5vh"
            align="center"
            key={inx}
            dangerouslySetInnerHTML={{ __html: title.description }}
            w="100%"
          />
        ))}

        {videoTitles.map((title, inx) => (
          <Center w="100%" key={inx}>
            <VideoPlayer
              src={title.file_url ?? ""}
              key={title.file_url}
              autoPlay
            />
          </Center>
        ))}

        {imageTitles.map((title) => (
          <Center w="100%">
            <Image
              src={title.file_url}
              alt={title.description}
              width={"100%"}
              key={title.file_url}
            />
          </Center>
        ))}

        <Stack
          spacing={lousaWidth * 0.025}
          justify="center"
          w="100%"
          px={boardW(20)}
        >
          {question.options.map((option, inx) => (
            <TextOptionButton
              key={inx}
              onClick={() => setAnswer(option)}
              data-selected={JSON.stringify(answer) === JSON.stringify(option)}
              sound={option.sound_url ?? undefined}
              isCorrect={option.isCorrect}
              className={classes.button}
            >
              {option.description}
            </TextOptionButton>
          ))}
        </Stack>
      </Group>
    </>
  );
}
