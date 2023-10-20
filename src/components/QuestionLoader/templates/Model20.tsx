import { Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DropArea, TextDropItem } from "~/components/TextDrop";
import { lousaHeight } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model20({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay, imageTitles } =
    useQuestionHelper(question);
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

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

  useEffect(() => {
    onAnswerChange(answers.filter((item) => item !== null) as QuestionOption[]);
  }, [answers]);

  useEffect(() => {
    setContinueDisabled(answers.some((item) => item === null));
  }, [answers]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={title.file_url}
                src={title.file_url!}
                autoPlay={audioTitleAutoplay(inx)}
              />
            ))}
        </Group>
      )}
      <Stack my="auto" align="center" spacing={10}>
        {imageTitles
          .filter((title) => title.file_url)
          .map((title, index) => (
            <img
              src={title.file_url!}
              key={index}
              style={{
                maxHeight: (lousaHeight * 30) / 100,
                width: "auto",
                objectFit: "contain",
              }}
            />
          ))}

        <DropArea items={answers} onDrop={setItem} onClear={clearItem} />

        <Group spacing={10}>
          {question.options.map((option, index) => (
            <TextDropItem
              item={option}
              key={index}
              customFontSize={24}
              hidden={
                !!answers.find(
                  (item) => JSON.stringify(item) === JSON.stringify(option)
                )
              }
            />
          ))}
        </Group>
      </Stack>
    </>
  );
}
