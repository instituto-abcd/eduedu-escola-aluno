import { Group, Image, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { IconVolume } from "@tabler/icons-react";
import { useState } from "react";
import { Answer, useGetExamQuestion } from "~/api/student";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { ModelProps } from ".";

export function QME2x2Video({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<Answer | null>(null);
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

  if (isLoading) return;

  return (
    <>
      <Group noWrap grow spacing={75} py={40} my="auto">
        <div>
          {question.titles?.map((title) => {
            if (title.type === "VIDEO") {
              return <VideoPlayer src={title.file_url} key={title.file_url} />;
            }
          })}
        </div>

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option) => (
            <OptionButton
              key={option.position}
              data-selected={answer?.position === option.position}
              sound={option.sound_url}
              onClick={() =>
                setAnswer({
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
            >
              {option.image_url && (
                <Image
                  src={option.image_url}
                  alt={option.description}
                  width={132}
                />
              )}
              {!option.image_url && option.sound_url && (
                <IconVolume size={80} />
              )}
              {!option.image_url && !option.sound_url && option.description && (
                <Text>{option.description}</Text>
              )}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>

      <EduButton disabled={answer === null} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
