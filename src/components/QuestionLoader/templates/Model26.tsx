import { Group, Image, Stack, Text, createStyles } from "@mantine/core";
import { produce } from "immer";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  letters: {
    width: boardW(60),
    height: boardW(40),
    padding: 0,
    textAlign: "center",
    fontSize: boardW(16),
    display: "grid",
    placeContent: "center",
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

  const isSlotsOnly = (title: string) =>
    title.replace(/_|\s/g, "").length === 0;

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
        <Stack align="center" spacing={boardW(20)} my="xl">
          {letterSlots && isSlotsOnly(letterSlots.description) && (
            <Group>
              {slots.map((slot, inx) => (
                <DragLetterSlot
                  onDrop={(item) => handleDrop(item, inx)}
                  option={slot}
                  onClear={() => handleClear(inx)}
                  key={inx}
                  className={classes.letters}
                  style={{
                    fontSize: boardW(16),
                  }}
                />
              ))}
            </Group>
          )}

          {letterSlots && !isSlotsOnly(letterSlots.description) && (
            <Group spacing={0}>
              {letterSlots.description
                .replaceAll("\\n ", "")
                .replaceAll("\\n", "")
                .split(/_+/g) // separa os segmentos de texto dos underlines
                .map((w, inx, arr) => {
                  const notLastFragment = arr.length !== inx + 1;
                  const isLastFragment = arr.length === 1 && w.endsWith(" ");
                  const isFirstFragment = arr.length === 1 && w.startsWith(" ");

                  const canRenderLast =
                    (isLastFragment || notLastFragment) && !isFirstFragment;
                  const canRenderFirst = isFirstFragment && !isLastFragment;

                  const slotLetterStyle: CSSProperties = {
                    fontSize: boardW(16),
                  };

                  return (
                    <Fragment key={inx}>
                      {canRenderFirst && (
                        <DragLetterSlot
                          onDrop={(item) => handleDrop(item, inx)}
                          option={slots[inx] ?? null}
                          onClear={() => handleClear(inx)}
                          className={classes.letters}
                          style={slotLetterStyle}
                        />
                      )}
                      {w.split(" ").map((frag, inx) => (
                        <Text
                          color="dark.3"
                          size={boardW(18)}
                          weight={700}
                          p={0}
                          my={2.5}
                          mx={2.5}
                          key={inx}
                        >
                          {frag}
                        </Text>
                      ))}

                      {canRenderLast && (
                        <DragLetterSlot
                          onDrop={(item) => handleDrop(item, inx)}
                          option={slots[inx] ?? null}
                          onClear={() => handleClear(inx)}
                          className={classes.letters}
                          style={slotLetterStyle}
                        />
                      )}
                    </Fragment>
                  );
                })}
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
