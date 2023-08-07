import { Button, Group, Loader, Stack, Text } from "@mantine/core";
import { exam as _exam } from "./mocks/exam";
import { useState } from "react";
import { produce } from "immer";
import { Question } from "~/api/exam";
import { QuestionLoader } from "~/components/QuestionLoader/QuestionLoader";
import { EduButton } from "~/components/EduButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Answers = {
  [key: string]: {
    answer: string;
    isCorrect: boolean;
  };
};

export function ExamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswer] = useState<Answers>({});

  const { data: exam } = { data: _exam };

  const isLoading = false;
  const hasNext = currentIndex < exam.questions.length - 1;
  const hasPrev = currentIndex > 0;

  function getQuestion(): Question {
    return exam.questions[currentIndex] as Question;
  }

  function nextQuestion() {
    setCurrentIndex((prev) => prev + 1);
  }

  function prevQuestion() {
    setCurrentIndex((prev) => prev - 1);
  }

  function onAnswer(answer: string, isCorrect: boolean) {
    setAnswer(
      produce((draft) => {
        draft[currentIndex] = {
          answer,
          isCorrect,
        };
      })
    );
  }

  return (
    <Stack
      align="center"
      justify="space-between"
      h="100%"
      style={{ position: "relative" }}
    >
      {isLoading && <Loader />}
      <Stack spacing={65} align="center" h="100%" w="100%" px={54}>
        <QuestionLoader question={getQuestion()} onAnswer={onAnswer} />
      </Stack>
      <Stack align="center" py="lg">
        <Group align="center">
          <EduButton
            leftIcon={<IconChevronLeft size={18} />}
            disabled={!hasPrev}
            onClick={prevQuestion}
          >
            Anterior
          </EduButton>
          <EduButton
            rightIcon={<IconChevronRight size={18} />}
            disabled={!hasNext}
            onClick={nextQuestion}
          >
            Continuar
          </EduButton>
        </Group>
        <Text
          color="dimmed"
          size="xs"
          style={{
            position: "absolute",
            bottom: -10,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {exam.questions[currentIndex].model}
        </Text>
      </Stack>
    </Stack>
  );
}
