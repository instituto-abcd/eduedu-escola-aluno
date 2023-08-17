import { Group, LoadingOverlay, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";

import { Answer, useGetExamQuestion } from "~/api/student";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton";

export function QMES5({ question, answerCallback }: ModelProps) {
  const [selected, setSelected] = useState<Answer[]>([]);
  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function selectItem(answer: Answer) {
    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          position: answer.position,
          positionAnswer: answer.position,
        },
      ]);
    }
  }

  function submitAnswer() {
    if (selected.length === 0) return;

    mutate({
      questionId: question.id,
      optionsAnswered: selected,
    });
  }

  useEffect(() => {
    setSelected([]);
  }, [question]);

  return (
    <>
      <Group noWrap grow spacing={75} py={40}>
        {question.titles?.map((title) => {
          if (title.type === "VIDEO") {
            return (
              <VideoPlayer src={title.file_url ?? ""} key={title.file_url} />
            );
          }
        })}

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option) => (
            <OptionButton
              key={option.description}
              onClick={() =>
                selectItem({
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
              data-selected={
                !!selected.find((item) => item.position === option.position)
              }
            >
              {option.description}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>

      <EduButton disabled={selected.length === 0} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
