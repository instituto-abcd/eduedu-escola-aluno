import {
  Button,
  Group,
  NumberInput,
  Paper,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { Question } from "~/api/exam";

type Props = {
  current: number;
  total: number;
  question: Question;
  onQuestionChange: (index: number) => void;
};

export function ModelProgress({
  current,
  total,
  question,
  onQuestionChange,
}: Props) {
  const progress = (current / total) * 100;
  const [jumper, setJumper] = useState<number>();

  return (
    <Paper p="sm" withBorder shadow="md">
      <Text color="dimmed" align="center" size="xs" weight={600}>
        Planeta: {question.planetTitle}
      </Text>
      <Stack align="center" w="100%" spacing={4} my="md">
        <Text weight={600} color="dark.3">
          {current} / {total}
        </Text>
        <Progress value={progress} w="100%" striped color="teal" animate />
      </Stack>

      <Group>
        <NumberInput
          value={jumper}
          onChange={(v) => setJumper(+v)}
          size="xs"
          min={0}
          max={total}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              Number.isInteger(jumper) && onQuestionChange(jumper as number);
            }
          }}
        />
        <Button
          onClick={() =>
            Number.isInteger(jumper) && onQuestionChange(jumper as number)
          }
          size="xs"
        >
          Pular
        </Button>
      </Group>
    </Paper>
  );
}
