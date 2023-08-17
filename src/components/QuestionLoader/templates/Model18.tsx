import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { Group, Image, LoadingOverlay, Stack } from "@mantine/core";
import { DraggableLetters } from "~/components/DraggableLetters";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";
import { Answer, useGetExamQuestion } from "~/api/student";
import { produce } from "immer";
import { EduButton } from "~/components/EduButton";

export function Model18({ question, answerCallback }: ModelProps) {
  const [selected, setSelected] = useState<Answer[]>([]);
  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);

  const text = textTitles[0].description;
  const [slots, setSlots] = useState<Array<QuestionOption | null | string>>(
    () => text.split("").map((char) => (char === "_" ? null : char))
  );

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (selected.length < 3) return;

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
      const indexOffset = index - text.replace(/_/gi, "").length;
      console.log(index, indexOffset);

      setSelected((state) =>
        produce(state, (draft) => {
          draft[indexOffset] = {
            position: item.position,
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

  return (
    <>
      {audioTitles.map((title) => (
        <AudioButton
          src={title.file_url ?? ""}
          key={title.file_name}
          autoPlay
        />
      ))}

      <Group my="auto" spacing={80}>
        {imageTitles.map((title) => (
          <Image src={title.file_url ?? ""} key={title.file_name} width={270} />
        ))}

        <Stack spacing={40}>
          <Group>
            {slots.map((slot, inx) => {
              if (typeof slot === "string")
                return <TextOptionButton key={slot}>{slot}</TextOptionButton>;

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
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((option) => (
                <DraggableLetters key={option.description} option={option}>
                  {option.description}
                </DraggableLetters>
              ))}
          </Group>
        </Stack>
      </Group>

      <EduButton
        disabled={selected.length < 3}
        onClick={submitAnswer}
        style={{ marginTop: "auto" }}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
