import { Group, Image, LoadingOverlay, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { Answer, useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton";

export function Model10({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const { imageTitles, textTitles, audioTitles } = useQuestionHelper(question);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (answer === null) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [answer],
    });
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      <Group>
        {audioTitles.map((title) => (
          <AudioButton
            src={title.file_url ?? ""}
            key={title.file_url}
            autoPlay
          />
        ))}

        {/* TODO: botão livro? */}
        {/* <IconButton icon={<IconBook size={34} />} variant="black" /> */}
      </Group>
      {textTitles.map((title) => (
        <Title color="dark.3" size={30} align="center" key={title.description}>
          {title.description}
        </Title>
      ))}

      <Group spacing={100} my="auto">
        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.description}
            width={270}
            key={title.file_url}
          />
        ))}

        <SimpleGrid cols={2}>
          {question.options
            .sort((a, b) => a.position - b.position)
            .map((option) => (
              <OptionButton
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
