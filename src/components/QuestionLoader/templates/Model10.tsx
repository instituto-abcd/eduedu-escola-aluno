import { Group, LoadingOverlay, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { EduButton } from "~/components/EduButton";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { IconVolume } from "@tabler/icons-react";

export function Model10({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, audioTitles, optionArrKey } =
    useQuestionHelper(question);

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

      {textTitles
        .filter(
          (title) => title.description && !title.placeholder.includes("ID")
        )
        .map((title) => (
          <Title
            color="dark.3"
            size={20}
            align="center"
            key={title.description}
            dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
          />
        ))}

      <Group spacing={100} my="auto">
        {imageTitles
          .filter((title) => title.file_url)
          .map((title) => (
            <img
              src={title.file_url!}
              alt={title.description}
              width={270}
              style={{ maxHeight: 400, objectFit: "contain" }}
              key={title.file_url}
            />
          ))}

        <SimpleGrid cols={2}>
          {question.options.map((option, inx) => (
            <OptionButton
              key={optionArrKey(option, inx)}
              onClick={() =>
                setAnswer({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? option.position
                    : undefined,
                })
              }
              data-selected={
                JSON.stringify(answer) ===
                JSON.stringify({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? option.position
                    : undefined,
                })
              }
              isCorrect={option.isCorrect}
              sound={option.sound_url ?? undefined}
            >
              {option.description}
              {option.image_url && (
                <img
                  src={option.image_url}
                  alt={option.description}
                  width={100}
                  style={{
                    maxHeight: 140,
                    objectFit: "contain",
                    marginInline: "auto",
                  }}
                />
              )}
              {!option.image_url && option.sound_url && (
                <IconVolume size={80} />
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
