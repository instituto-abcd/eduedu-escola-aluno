import { Group, SimpleGrid, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { DraggableCardSlot, DraggableCard } from "~/components/DraggableCard";
import { useCallback, useEffect, useState } from "react";
import { produce } from "immer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";

export function Model2({ question, onAnswerChange }: ModelProps) {
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const handleDrop = useCallback(function (
    item: QuestionOption | null,
    index: number
  ) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item ? { ...item, positionAnswer: index } : item;
      })
    );
  },
  []);

  const { audioTitles } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setAnswers(question.options.map(() => null));
  }, [question]);

  useEffect(() => {
    onAnswerChange(
      answers.filter((answer) => answer !== null) as QuestionOption[]
    );
  }, [answers]);

  return (
    <>
      {/* Action buttons */}
      {audioTitles.some((title) => title.file_url) && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((title) => (
              <AudioButton
                key={title.file_url}
                src={title.file_url ?? ""}
                autoPlay
              />
            ))}
        </Group>
      )}

      {/* Board content */}
      <Stack my="auto">
        <SimpleGrid cols={question.options.length} spacing={boardW(24)}>
          {answers.map((slot, inx) => (
            <DraggableCardSlot
              key={inx}
              onDrop={(item) => handleDrop(item, inx)}
              item={slot}
              replaceWith={
                <DraggableCard
                  item={slot}
                  image={slot?.image_url}
                  text={slot?.description}
                  sound={slot?.sound_url}
                  disabled
                  onClear={() => handleDrop(null, inx)}
                />
              }
            />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={question.options.length} spacing={boardW(24)}>
          {question.options.map((item) => (
            <DraggableCard
              item={item}
              key={item.position}
              image={item.image_url}
              text={item.description}
              sound={item.sound_url}
              hidden={
                !!answers.find((slot) => slot?.position === item.position) ||
                mediaTrack.isPlaying
              }
            />
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}
