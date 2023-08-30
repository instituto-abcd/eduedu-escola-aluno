import { Group, Image, LoadingOverlay, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { EduButton } from "~/components/EduButton";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";

export function Model10({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, audioTitles } = useQuestionHelper(question);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (answer === null) return;

    mutate({
      planetId: question.planet_id,
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
      </Group>

      {textTitles.map((title) => (
        <Title
          color="dark.3"
          size={30}
          align="center"
          key={title.description}
          dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
        />
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
          {question.options.map((option) => (
            <OptionButton
              key={option.description}
              onClick={() =>
                setAnswer({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? answer?.position
                    : undefined,
                })
              }
              data-selected={JSON.stringify(answer) === JSON.stringify(option)}
              isCorrect={option.isCorrect}
            >
              {option.description}
              {option.image_url && (
                <Image
                  src={option.image_url}
                  alt={option.description}
                  width={100}
                  mx="auto"
                />
              )}
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
