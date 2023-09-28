import { Group, Image, LoadingOverlay, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { produce } from "immer";
import { DraggableLetters } from "~/components/DraggableLetters";
import { EduButton } from "~/components/EduButton";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight } from "~/constants/dimensions";

export function Model26({ question, answerCallback }: ModelProps) {
  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);

  const letterSlots = textTitles.find((title) =>
    title.description.includes("__")
  );

  const isSlotsOnly = (title: string) => !title.replace(/_|\s/g, "");

  const initialSlots =
    letterSlots && isSlotsOnly(letterSlots.description)
      ? letterSlots.description.split(" ").map(() => null)
      : [];

  const [slots, setSlots] =
    useState<Array<QuestionOption | null>>(initialSlots);
  const disabled = slots.includes(null);

  function handleDrop(item: QuestionOption | null, index: number) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );
  }

  function handleClear(index: number) {
    handleDrop(null, index);
  }

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (disabled) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: slots as QuestionOption[],
    });
  }

  useEffect(() => {
    setSlots(initialSlots);
  }, [question]);

  return (
    <>
      {audioTitles.length > 0 && (
        <Group position="center">
          {audioTitles
            .filter((title) => !!title.file_url)
            .map((title) => (
              <AudioButton
                src={title.file_url ?? ""}
                autoPlay
                key={title.file_url}
              />
            ))}
        </Group>
      )}

      {imageTitles[0] && (
        <Image src={imageTitles[0].file_url ?? ""} width={225} height={225} />
      )}

      <Stack align="center" spacing={24}>
        {letterSlots && isSlotsOnly(letterSlots.description) && (
          <Group>
            {slots.map((slot, inx) => (
              <DragLetterSlot
                onDrop={(item) => handleDrop(item, inx)}
                option={slot}
                onClear={() => handleClear(inx)}
                key={inx}
              />
            ))}
          </Group>
        )}
        <Group>
          {question.options.map((option) => (
            <DraggableLetters
              option={option}
              key={option.description}
              hidden={
                !!slots.find(
                  (item) =>
                    JSON.stringify(item) === JSON.stringify(option) && item
                )
              }
            />
          ))}
        </Group>
      </Stack>

      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
