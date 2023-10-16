import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { boardW } from "~/constants/dimensions";
import { Group, ScrollArea, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { AudioButton } from "~/components/AudioButton";
import { IconVolume } from "@tabler/icons-react";
import { ReadButton } from "~/components/ReadButton";

export function Model10({
  question,
  auxQuestion,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, audioTitles, audioTitleAutoplay } =
    useQuestionHelper(question);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  useEffect(() => {
    setAnswer(null);
    setContinueDisabled(!answer);
  }, [question]);

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
                autoPlay={audioTitleAutoplay(inx)}
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
    </>
  );
}
