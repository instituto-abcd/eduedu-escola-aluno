import { Group, Image, LoadingOverlay, Stack, Title } from "@mantine/core";

import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useEffect, useState } from "react";
import { Answer } from "~/api/student";
import { VideoPlayer } from "~/components/VideoPlayer";
import { AudioButton } from "~/components/AudioButton";
import { usePlanetAnswer } from "~/api/planet";
import { QuestionOption } from "~/api/exam";

export function Model8({ question, answerCallback }: ModelProps) {
  const { imageTitles, videoTitles, textTitles, audioTitles, optionArrKey } =
    useQuestionHelper(question);

  const [answer, setAnswer] = useState<Answer | null>(null);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      planetId: question.planet_id,
      optionsAnswered: [{ position: answer.position, positionAnswer: 0 } as QuestionOption ],
    });
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton key={title.position} src={title.file_url ?? ""} autoPlay />
      ))}

      {textTitles.map((title) => (
        <Title color="dark.3" size={30} align="center">
          {title.description}
        </Title>
      ))}

      <Group my="auto" position="apart">
        {videoTitles.map((title) => (
          <VideoPlayer src={title.file_url ?? ""} key={title.file_url} />
        ))}

        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.description}
            width={270}
            key={title.file_url}
          />
        ))}

        <Stack align="stretch" spacing={40} w={555}>
          {question.options.map((option, inx) => (
            <TextOptionButton
              key={optionArrKey(option, inx)}
              onClick={() =>
                setAnswer({
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
              data-selected={answer?.position === option.position}
              sound={option.sound_url ?? undefined}
              isCorrect={option.isCorrect}
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
