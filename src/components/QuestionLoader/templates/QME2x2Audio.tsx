import { Group, LoadingOverlay, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconBook, IconVolume } from "@tabler/icons-react";
import { OptionButton } from "~/components/OptionButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { AudioControls } from "~/components/AudioControls/AudioControls";
import { Answer, useGetExamQuestion } from "~/api/student";
import { useState } from "react";
import { EduButton } from "~/components/EduButton";

export function QME2x2Audio({ question, answerCallback }: ModelProps) {
  const { audioTitles } = useQuestionHelper(question);

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

  const cols = question.options.length < 6 ? question.options.length / 2 : 3;
  return (
    <>
      {audioTitles
        .filter(
          (title) =>
            title.description === "text" &&
            !title.file_name.split(".")[0].endsWith("intro")
        )
        .map((title) => (
          <AudioControls src={title.file_url} key={title.file_url} />
        ))}

      <Group>
        {audioTitles
          .filter((title) => title.description === "question")
          .map((title) => (
            <AudioButton src={title.file_url} key={title.file_url} />
          ))}

        {audioTitles
          .filter(
            (title) =>
              title.description === "text" &&
              title.file_name.split(".")[0].endsWith("intro")
          )
          .map((title) => (
            <AudioButton
              src={title.file_url}
              key={title.file_url}
              autoPlay
              buttonProps={{ variant: "yellow", icon: <IconBook /> }}
            />
          ))}
      </Group>

      <SimpleGrid cols={cols}>
        {question.options.map((option) => (
          <OptionButton
            key={option.position}
            sound={option.sound_url}
            onClick={() =>
              setAnswer({
                position: option.position,
                positionAnswer: option.position,
              })
            }
            data-selected={answer?.position === option.position}
          >
            <Stack justify="space-evenly">
              <IconVolume size={62} />
              <Text color="dark.6" size={30} weight={400}>
                {option.position + 1}
              </Text>
            </Stack>
          </OptionButton>
        ))}
      </SimpleGrid>
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{ minHeight: "max-content" }}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
