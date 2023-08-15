import { Group, Image, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { useState } from "react";
import { Question } from "~/api/exam";
import { Answer, useGetExamQuestion } from "~/api/student";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton";

export function QME2x3Video({ question, answerCallback }: ModelProps) {
  const { videoTitles } = useQuestionHelper(question);
  const [selected, setSelected] = useState<Answer[]>([]);
  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function selectItem(_answer: Question["options"][0]) {
    const answer = {
      position: _answer.position,
      positionAnswer: _answer.position,
    };

    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          position: _answer.position,
          positionAnswer: _answer.position,
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

  return (
    <>
      <Group noWrap grow spacing={75} py={40} my="auto">
        <div>
          {videoTitles.map((title) => (
            <VideoPlayer key={title.file_url} src={title.file_url ?? ""} />
          ))}
        </div>

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option) => (
            <OptionButton
              key={option.position}
              data-selected={
                !!selected.find((item) => item.position === option.position)
              }
              onClick={() => selectItem(option)}
            >
              {option.image_url && (
                <Image
                  src={option.image_url}
                  alt={option.description}
                  width={132}
                />
              )}
              {!option.image_url && option.description && (
                <Text>{option.description}</Text>
              )}
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
