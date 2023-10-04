import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer, usePlanetGetQuestion } from "~/api/planet";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { boardW, lousaHeight } from "~/constants/dimensions";
import {
  Group,
  LoadingOverlay,
  ScrollArea,
  SimpleGrid,
  Title,
} from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { EduButton } from "~/components/EduButton";
import { AudioButton } from "~/components/AudioButton";
import { IconVolume } from "@tabler/icons-react";
import { ReadButton } from "~/components/ReadButton";

export function Model10({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, audioTitles, supportText } =
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

  const { data: auxQuestion } = usePlanetGetQuestion(
    question.planet_id,
    supportText[0]?.["description"] ?? "",
    {
      enabled: !!supportText[0]?.["description"],
    }
  );

  /* TODO: jogar para o questionhelper */
  const canPlay = (inx: number) => {
    if (inx !== 0) return false;
    const rule = question.rules.find((rule) => rule.name === "autoplay");

    if (!rule) return false;
    return rule.value === "true";
  };

  return (
    <>
      {audioTitles.some((title) => title.file_url) && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((item, inx) => (
              <AudioButton
                src={item.file_url ?? ""}
                key={inx}
                autoPlay={canPlay(inx)}
              />
            ))}

          {auxQuestion && <ReadButton question={auxQuestion} />}
        </Group>
      )}

      {textTitles
        .filter(
          (title) => title.description && !title.placeholder.includes("ID")
        )
        .map((title, inx) => (
          <ScrollArea mah={boardW(100)} type="always" key={inx} px="xs">
            <Title
              color="dark.3"
              size={boardW(22)}
              align="center"
              dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
              px={boardW(10)}
            />
          </ScrollArea>
        ))}

      <Group spacing={20} my="auto">
        {imageTitles
          .filter((title) => title.file_url)
          .map((title) => (
            <img
              src={title.file_url!}
              alt={title.description}
              width={boardW(350)}
              style={{ maxHeight: boardW(400), objectFit: "contain" }}
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
                  width={boardW(100)}
                  style={{
                    maxHeight: boardW(110),
                    objectFit: "contain",
                    marginInline: "auto",
                  }}
                />
              )}
              {!option.image_url && option.sound_url && (
                <IconVolume size={boardW(80)} />
              )}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>

      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}
      >
        Continuar
      </EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
