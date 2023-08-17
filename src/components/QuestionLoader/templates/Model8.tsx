import { Group, Image, LoadingOverlay, Stack, Title } from "@mantine/core";

import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useEffect, useState } from "react";
import { Answer, useGetExamQuestion } from "~/api/student";
import { VideoPlayer } from "~/components/VideoPlayer";

export function Model8({ question, answerCallback }: ModelProps) {
  const { imageTitles, videoTitles, textTitles } = useQuestionHelper(question);

  const [answer, setAnswer] = useState<Answer | null>(null);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [{ position: answer.position, positionAnswer: 0 }],
    });
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {textTitles.map((title) => (
        <Title color="dark.3" size={30} align="center">
          {title.description}
        </Title>
      ))}

      <Group my="auto">
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
          {question.options
            .sort((a, b) => a.position - b.position)
            .map((option) => (
              <TextOptionButton
                key={option.description}
                onClick={() =>
                  setAnswer({
                    position: option.position,
                    positionAnswer: option.position,
                  })
                }
                data-selected={answer?.position === option.position}
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
