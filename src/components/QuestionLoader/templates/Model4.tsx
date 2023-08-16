import { Group, Image, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { Answer, useGetExamQuestion } from "~/api/student";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton";

export function Model4({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const { audioTitles } = useQuestionHelper(question);

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
  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton key={title.position} src={title.file_url ?? ""} autoPlay />
      ))}
      <Stack my="auto">
        <Group spacing={24}>
          {question.options.map((option) => (
            <OptionButton
              key={option.position}
              data-selected={answer?.position === option.position}
              onClick={() =>
                setAnswer({
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
              sound={option.sound_url ?? undefined}
            >
              {option.image_url && (
                <>
                  <Image
                    src={option.image_url}
                    alt={option.description}
                    height={105}
                    width="auto"
                  />
                  {question.axis_code && question.axis_code !== null && (
                    <Text size={14} color="gray.7" weight={600}>
                      {option.description}
                    </Text>
                  )}
                </>
              )}
              {!option.image_url && <Text>{option.description}</Text>}
            </OptionButton>
          ))}
        </Group>
      </Stack>

      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
