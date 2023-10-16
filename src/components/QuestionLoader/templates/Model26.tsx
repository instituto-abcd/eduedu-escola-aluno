import { Group, Image, Stack, createStyles } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  letters: {
    width: boardW(100),
    height: boardW(80),
    paddingInline: 0,
    textAlign: "center",
  },
});
export function Model26({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const { classes } = useStyles();
  const {
    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    imageTitles,
    textTitles,
  } = useQuestionHelper(question);
  const letterSlots = textTitles.find((title) =>
    title?.description?.includes("__")
  );
  const isSlotsOnly = (title: string) => !title.replace(/_|\s/g, "");

  const initialSlots =
    letterSlots && isSlotsOnly(letterSlots.description)
      ? letterSlots.description.split(" ").map(() => null)
      : [];

  const [slots, setSlots] =
    useState<Array<QuestionOption | null>>(initialSlots);

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

  useEffect(() => {
    setSlots(initialSlots);
  }, [question]);

  useEffect(() => {
    onAnswerChange(slots.filter((slot) => slot !== null) as QuestionOption[]);
  }, [slots]);

  useEffect(() => {
    setContinueDisabled(slots.includes(null));
  }, [slots]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url ?? ""}
              autoPlay={audioTitleAutoplay(inx)}
              key={title.file_url}
            />
          ))}
        </Group>
      )}

      <Stack my="auto" align="center">
        {imageTitles[0] && (
          <Image
            src={imageTitles[0].file_url ?? ""}
            width="auto"
            height={boardW(200)}
          />
        )}
        <Stack align="center" spacing={boardW(20)}>
          {letterSlots && isSlotsOnly(letterSlots.description) && (
            <Group>
              {slots.map((slot, inx) => (
                <DragLetterSlot
                  onDrop={(item) => handleDrop(item, inx)}
                  option={slot}
                  onClear={() => handleClear(inx)}
                  key={inx}
                  style={{
                    width: boardW(100),
                    height: boardW(80),
                    paddingInline: 0,
                    textAlign: "center",
                  }}
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
                className={classes.letters}
              />
            ))}
          </Group>
        </Stack>
      </Stack>
    </>
  );
}
