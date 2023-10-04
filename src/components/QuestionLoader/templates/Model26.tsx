import { Group, Image, LoadingOverlay, Stack, createStyles } from "@mantine/core";
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
import { boardW, lousaHeight } from "~/constants/dimensions";

const useStyles = createStyles({
  letters: {
    width: boardW(100),
    height: boardW(80),
    paddingInline: 0,
    textAlign: "center"
  },
});
export function Model26({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();

  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);

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
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles.length > 0 && (
          audioTitles
            .filter((title) => !!title.file_url)
            .map((title) => (
              <AudioButton
                src={title.file_url ?? ""}
                autoPlay
                key={title.file_url}
              />
            ))
        )}
      </Group>

      {/* Board content */}
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

      {/* Continue to the next screen button */}
      <EduButton disabled={disabled} onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
