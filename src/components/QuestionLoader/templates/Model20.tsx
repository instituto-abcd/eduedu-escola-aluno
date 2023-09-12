import { Group, LoadingOverlay, Stack } from "@mantine/core";
import { EduButton } from "~/components/EduButton/EduButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { usePlanetAnswer } from "~/api/planet";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { DropArea, TextDropItem } from "~/components/TextDrop";

export function Model20({ question, answerCallback }: ModelProps) {
  const { audioTitles, imageTitles } = useQuestionHelper(question);
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const disabled = answers.includes(null);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (disabled) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: answers.map((option, inx) => ({
        ...option,
        positionAnswer: inx,
      })) as QuestionOption[],
    });
  }

  function setItem(option: QuestionOption) {
    setAnswers((prev) => {
      const index = prev.findIndex((item) => item === null);
      if (index === -1) return prev;

      const next = [...prev];
      next[index] = option;

      return next;
    });
  }

  function clearItem(index: number) {
    setAnswers((prev) => {
      let next = [...prev];
      next = next.filter((_, inx) => inx !== index);
      next.push(null);

      return next;
    });
  }

  useEffect(() => {
    setAnswers(question.options.map(() => null));
  }, [question]);

  return (
    <>
      {audioTitles.filter((title) => title.file_url).length > 0 && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={title.file_url}
                src={title.file_url!}
                autoPlay={inx === 0}
              />
            ))}
        </Group>
      )}

      <Stack my="auto" align="center" spacing={24}>
        {imageTitles
          .filter((title) => title.file_url)
          .map((title, index) => (
            <img
              src={title.file_url!}
              key={index}
              style={{ maxHeight: 280, maxWidth: 800, objectFit: "contain" }}
            />
          ))}

        <DropArea items={answers} onDrop={setItem} onClear={clearItem} />

        <Group spacing={28}>
          {question.options.map((option, index) => (
            <TextDropItem
              item={option}
              key={index}
              hidden={
                !!answers.find(
                  (item) => JSON.stringify(item) === JSON.stringify(option)
                )
              }
            />
          ))}
        </Group>
      </Stack>

      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
