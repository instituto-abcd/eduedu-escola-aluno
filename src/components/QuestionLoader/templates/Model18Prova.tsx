import { Group, Image, Stack } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { TextOptionButton } from "~/components/OptionButton";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model18Prova({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);
  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);

  const text = textTitles[0].description;
  const [slots, setSlots] = useState<Array<QuestionOption | null | string>>(
    () => text.split("").map((char) => (char === "_" ? null : char))
  );

  function handleDrop(item: QuestionOption | null, index: number) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );

    if (item) {
      const indexOffset = index - text.replace(/_/gi, "").length;

      setSelected((state) =>
        produce(state, (draft) => {
          draft[indexOffset] = {
            ...item,
            positionAnswer: indexOffset,
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
  }, [question]);

  useEffect(() => {
    setSlots(text.split("").map((char) => (char === "_" ? null : char)));
  }, [text]);

  useEffect(() => {
    onAnswerChange(selected);
    setContinueDisabled(
      selected.length !== slots.filter((slot) => slot === null).length
    );
  }, [selected]);

  return (
    <>
      <Group mx="auto">
        {audioTitles.map((title) => (
          <AudioButton
            src={title.file_url ?? ""}
            key={title.file_name}
            autoPlay
          />
        ))}
      </Group>
      <Stack>
        {imageTitles.map((title) => (
          <Image
            src={title.file_url ?? ""}
            key={title.file_name}
            height={(lousaHeight * 35) / 100}
            width="auto"
            m="auto"
          />
        ))}

        <Stack spacing={20}>
          <Group mx="auto">
            {slots.map((slot, inx) => {
              if (typeof slot === "string")
                return (
                  <TextOptionButton
                    key={slot}
                    style={{
                      width: (lousaWidth * 8) / 100,
                      height: (lousaWidth * 8) / 100,
                      fontSize: "2.5vw",
                      fontWeight: 600,
                    }}
                  >
                    {slot}
                  </TextOptionButton>
                );

              return (
                <DragLetterSlot
                  onDrop={(item) => handleDrop(item, inx)}
                  option={slot}
                  onClear={() => handleClear(inx)}
                  key={inx}
                  style={{
                    width: (lousaWidth * 8) / 100,
                    height: (lousaWidth * 8) / 100,
                    textAlign: "center",
                  }}
                />
              );
            })}
          </Group>

          <Group mx="auto">
            {question.options.map((option) => (
              <DraggableLetters
                key={option.description}
                option={option}
                hidden={
                  !!slots.find(
                    (item) =>
                      item &&
                      typeof item !== "string" &&
                      item.position === option.position
                  )
                }
                style={{
                  width: (lousaWidth * 8) / 100,
                  height: (lousaWidth * 8) / 100,
                  textAlign: "center",
                }}
              >
                {option.description}
              </DraggableLetters>
            ))}
          </Group>
        </Stack>
      </Stack>
    </>
  );
}
