import { Button, Paper, Select, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Question } from "~/api/exam";

export function QuestionNavigator({
  questions,
  current,
  onNavigate,
}: {
  questions: Question[];
  current: number;
  onNavigate: (inx: number) => void;
}) {
  const [value, setValue] = useState<string | null>(current.toString());

  useEffect(() => {
    setValue(current.toString());
  }, [current]);

  return (
    <Paper p="sm" withBorder shadow="md">
      <Stack align="flex-end">
        <Text color="dimmed" size={10} weight={700} align="center" w="100%">
          © QUESTION NAVIGATOR 5000 (beta)
        </Text>
        <Select
          data={questions.map((q, inx) => ({
            label: `${inx} — ${q.model_id}`,
            value: inx.toString(),
          }))}
          label="Navegar questões"
          value={value}
          onChange={setValue}
          searchable
        />
        <Button
          onClick={() => value && onNavigate(+value)}
          size="sm"
          compact
          color="teal"
        >
          Go →
        </Button>
      </Stack>
    </Paper>
  );
}
