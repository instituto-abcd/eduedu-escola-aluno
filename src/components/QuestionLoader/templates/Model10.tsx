// Utils & Aux:
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

// Components:
import { Group, LoadingOverlay, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { EduButton, IconButton } from "~/components/EduButton";
import { AudioButton } from "~/components/AudioButton";

// Icons:
import { IconBook, IconVolume } from "@tabler/icons-react";

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
      {/* Action buttons */}
      <Group style={{ display: 'flex', justifyContent: 'center' }}>
        {audioTitles.map((item, inx) => (
          <>
            {item.file_url && item.file_url.length &&
              <AudioButton
                src={item.file_url ?? ""}
                key={inx}
                autoPlay={inx === 0}
              />
            }
          </>
        ))}

        {/* TODO: como que faz isso meu pai? x.x */}
        <IconButton icon={<IconBook size={34} />} variant="yellow" />
      </Group>

      {/* Board content */}
      {textTitles
        .filter(
          (title) => title.description && !title.placeholder.includes("ID")
        )
        .map((title, inx) => (
          <Title
            color="dark.3"
            size={20}
            align="center"
            key={inx}
            dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
          />
        ))}

      <Group spacing={20} my="auto">
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
              key={inx}
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

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: "10px",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
