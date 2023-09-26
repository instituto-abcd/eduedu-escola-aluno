import { Group, LoadingOverlay, SimpleGrid, createStyles } from "@mantine/core";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { useGetExamQuestion } from "~/api/student";
import { QuestionOption } from "~/api/exam";
import { EduButton } from "~/components/EduButton";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { produce } from "immer";
import { TextOptionButton } from "~/components/OptionButton";
import { useMediaTrackStore } from "~/stores/media-track.store";

const useStyles = createStyles({
  letters: {
    width: 87,
    maxHeight: 78,
  },
});

type Slot = string | null | QuestionOption;

export function QORD3x2({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();
  const { audioTitles, textTitles } = useQuestionHelper(question);
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

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (disabled) return;

    mutate({
      questionId: question.id,
      optionsAnswered: selected,
    });
  }

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

  const mediaTrack = useMediaTrackStore();

  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton autoPlay src={title.file_url ?? ""} key={title.file_url} />
      ))}

      <Group mt="auto">
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

      <SimpleGrid
        cols={3}
        style={{ placeItems: "center" }}
        spacing={24}
        mb="auto"
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
      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
