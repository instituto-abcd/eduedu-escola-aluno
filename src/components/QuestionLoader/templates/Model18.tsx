import { Group, Image, LoadingOverlay, Stack } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { usePlanetAnswer } from "~/api/planet";

export function Model18({ question, answerCallback }: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);
  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);

  const text = textTitles.filter(
    (title) => title.description && title.description.length > 0
  )[0].description;
  const [slots, setSlots] = useState<Array<QuestionOption | null | string>>(
    () =>
      text
        .replace(/\s/g, "")
        .split("")
        .map((char) => (char === "_" ? null : char))
  );

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (selected.length < 3) return;

    mutate({
      questionId: question.id,
      planetId: question.planet_id,
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
    setSlots(
      text
        .replace(/\s/g, "")
        .split("")
        .map((char) => (char === "_" ? null : char))
    );
  }, [text]);

  return (
    <>
      {audioTitles.some((title) => title.file_url) && (
        <Group mx="auto">
          {audioTitles
            .filter((title) => !!title.file_url)
            .map((title, inx) => (
              <AudioButton src={title.file_url ?? ""} key={inx} autoPlay />
            ))}
        </Group>
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
              return <TextOptionButton key={inx}>{slot}</TextOptionButton>;

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
              option={option}
              hidden={
                !!slots.find(
                  (item) =>
                    item &&
                    typeof item !== "string" &&
                    JSON.stringify(item) === JSON.stringify(option)
                )
              }
            >
              {option.description}
            </DraggableLetters>
          ))}
        </Group>
      </Stack>

      <EduButton disabled={selected.length < 3} onClick={submitAnswer}>
        Continuar
      </EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
