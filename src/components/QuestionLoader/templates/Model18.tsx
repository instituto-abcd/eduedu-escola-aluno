import { useEffect, useMemo, useState } from "react";
import { Group, Image, Stack, Text } from "@mantine/core";
import { produce } from "immer";
import { QuestionOption } from "~/api/exam";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";

export function Model18({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);
  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);

  const text = useMemo(
    () =>
      textTitles.filter(
        (title) => title.description && title.description.length > 0,
      )[0].description,
    [question],
  );

  const [slots, setSlots] = useState<Array<QuestionOption | null | string>>(
    () =>
      text
        .replace(/\s/g, "")
        .split("")
        .map((char) => (char === "_" ? null : char)),
  );

  function handleDrop(item: QuestionOption | null, index: number) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      }),
    );

    if (item) {
      setSelected((prevSelected) =>
        prevSelected.concat({
          ...item,
          positionAnswer: index,
        }),
      );
    }
  }

  function handleClear(index: number) {
    handleDrop(null, index);
    setSelected(selected.filter((_) => _.positionAnswer !== index));
  }

  useEffect(() => {
    setSelected([]);
    setSlots(
      text
        .replace(/\s/g, "")
        .split("")
        .map((char) => (char === "_" ? null : char)),
    );
  }, [question]);

  useEffect(() => {
    onAnswerChange(selected);
  }, [selected]);

  const conditions = useMemo(
    () => [slots.every((slot) => slot !== null)],
    [slots],
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const textAboveQuestion = textTitles.filter((t) =>
    t.placeholder.includes("som"),
  )[0];

  return (
    <>
      {audioTitles.filter((title) => title.file_url) && (
        <AudioContainer question={question} audioTitles={audioTitles} />
      )}

      {textAboveQuestion && (
        <Text size={boardW(24)} color="dark.3" weight={500}>
          {textAboveQuestion.description}
        </Text>
      )}

      {imageTitles.map((title) => (
        <Image
          src={title.file_url ?? ""}
          key={title.file_url}
          height={boardW(180)}
          width="auto"
        />
      ))}

      <Stack spacing={boardW(20)} my="auto" justify="center" align="center">
        <Group spacing={boardW(14)}>
          {slots.map((slot, inx) => {
            if (typeof slot === "string")
              return (
                <TextOptionButton key={inx} debug={{ skipDebug: true }}>
                  {slot}
                </TextOptionButton>
              );

            return (
              <DragLetterSlot
                onDrop={(item) => handleDrop(item, inx)}
                option={slot}
                onClear={() => handleClear(inx)}
                key={inx}
              />
            );
          })}
        </Group>

        <Group>
          {question.options.map((option, inx) => (
            <DraggableLetters
              key={inx}
              debug={{ skipDebug: true }}
              option={{
                ...option,
                description: option.description.toUpperCase(),
              }}
              hidden={
                !!slots.find(
                  (item) =>
                    item &&
                    typeof item !== "string" &&
                    JSON.stringify(item) === JSON.stringify(option),
                )
              }
            >
              {option.description}
            </DraggableLetters>
          ))}
        </Group>
      </Stack>
    </>
  );
}
