import {
  Center,
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Title,
  createStyles,
} from "@mantine/core";

import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useEffect, useState } from "react";
import { VideoPlayer } from "~/components/VideoPlayer";
import { AudioButton } from "~/components/AudioButton";
import { usePlanetAnswer } from "~/api/planet";
import { QuestionOption } from "~/api/exam";
import { BOARD_WIDTH } from "~/constants/dimensions";

const useStyles = createStyles({
  button: {
    width: "100%",
  },
});

export function Model8({ question, answerCallback }: ModelProps) {
  const { imageTitles, videoTitles, textTitles, audioTitles, optionArrKey } =
    useQuestionHelper(question);

  const { classes } = useStyles();

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      planetId: question.planet_id,
      optionsAnswered: [answer] as QuestionOption[],
    });
  }

  const halfWidthOptions = imageTitles.length === 0 && videoTitles.length === 0;

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {audioTitles.map((title, inx) => (
        <AudioButton
          key={inx}
          src={title.file_url ?? ""}
          autoPlay={inx === 0}
        />
      ))}

      {textTitles.map((title, inx) => (
        <Title color="dark.3" size="2.5vh" align="center" key={inx}>
          {title.description}
        </Title>
      ))}

      <Group my="auto" noWrap w={BOARD_WIDTH}>
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
          align={"stretch"}
          mx={"auto"}
          spacing={40}
          justify="center"
          w={halfWidthOptions ? "50%" : "100%"}
          px={20}
        >
          {question.options.map((option, inx) => (
            <TextOptionButton
              key={optionArrKey(option, inx)}
              onClick={() => setAnswer(option)}
              data-selected={answer?.position === option.position}
              sound={option.sound_url ?? undefined}
              isCorrect={option.isCorrect}
              className={classes.button}
            >
              {option.description}
            </TextOptionButton>
          ))}
        </Stack>
      </Group>

      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
