import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
  Title,
  Group,
  LoadingOverlay,
  Image,
  Stack,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { IconVolume } from "@tabler/icons-react";
import { Answer, useGetExamQuestion } from "~/api/student";
import { useEffect, useState } from "react";

export function Model8Prova({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles, imageTitles, optionArrKey } =
    useQuestionHelper(question);
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
      {audioTitles.map((title) => (
        <AudioButton key={title.position} src={title.file_url ?? ""} autoPlay />
      ))}

      {textTitles.map((title) => (
        <Title color="dark.3" size={30} align="center">
          {title.description}
        </Title>
      ))}

      <Group my="auto" position="apart" spacing={150}>
        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.description}
            width={270}
            key={title.file_url}
          />
        ))}

        <SimpleGrid cols={2}>
          {question.options.map((option, inx) => (
            <OptionButton
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
              <Stack justify="space-evenly">
                <IconVolume size={62} />
                <Text color="dark.6" size={30} weight={400}>
                  {inx + 1}
                </Text>
              </Stack>
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>

      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
