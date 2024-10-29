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
    <Stack align="flex-end">
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
        fullWidth
      >
        Go
      </Button>
    </Stack>
  );
}
