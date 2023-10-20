import { Group, SimpleGrid, Stack, createStyles } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { TextOptionButton } from "~/components/OptionButton";
import { lousaPaddingTop } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";

const useStyles = createStyles({
  letters: {
    width: 87,
    maxHeight: 78,
  },
});

type Slot = string | null | QuestionOption;

export function QORD3x2({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const { classes } = useStyles();
  const { audioTitles, hasAudioTitle, audioTitleAutoplay, textTitles } =
    useQuestionHelper(question);
  const startingSlots =
    textTitles.length > 0
      ? textTitles[0].description
          .split("")
          .map((char) => (char === "_" ? null : char))
      : [null, null];

  const [selected, setSelected] = useState<QuestionOption[]>([]);

  const [slots, setSlots] = useState<Slot[]>(startingSlots);
  const disabled =
    selected.filter(Boolean).length <
    slots.filter((slot) => typeof slot !== "string").length;

  function handleDrop(item: QuestionOption | null, index: number) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );

    if (item) {
      setSelected((state) =>
        produce(state, (draft) => {
          draft[index] = {
            ...item,
            positionAnswer: index,
          };
        })
      );
    }
  }

  function handleClear(index: number) {
    handleDrop(null, index);
    setSelected(selected.filter((_, inx) => inx !== index));
  }

  useEffect(() => {
    setSelected([]);
    setSlots(startingSlots);
  }, [question]);

  useEffect(() => {
    onAnswerChange(selected);
  }, [selected]);

  useEffect(() => {
    setContinueDisabled(disabled);
  }, [disabled]);

  const mediaTrack = useMediaTrackStore();

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto">
          {audioTitles.map((title, inx) => (
            <AudioButton
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url ?? ""}
              key={title.file_url}
            />
          ))}
        </Group>
      )}

      <Stack pt={lousaPaddingTop} m="auto">
        {/* Slots */}
        <Group mx="auto" mb={20}>
          {slots.map((slot, inx) => {
            if (typeof slot === "string")
              return <TextOptionButton key={slot}>{slot}</TextOptionButton>;

            return (
              <DragLetterSlot
                key={inx}
                onDrop={(item) => handleDrop(item, inx)}
                option={slot}
                onClear={() => handleClear(inx)}
                className={classes.letters}
              />
            );
          })}
        </Group>

        {/* Anwsers options  */}
        <SimpleGrid
          mx="auto"
          cols={3}
          style={{ placeItems: "center" }}
          spacing={20}
        >
          {question.options.map((option, inx) => (
            <DraggableLetters
              key={`[${inx}]-[${option.position}]:${option.image_url ?? ""}`}
              option={option}
              hidden={
                !!slots.find(
                  (item) =>
                    item &&
                    typeof item !== "string" &&
                    item.position === option.position
                ) || mediaTrack.isPlaying
              }
              className={classes.letters}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}
