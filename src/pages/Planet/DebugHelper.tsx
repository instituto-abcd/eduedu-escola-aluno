import {
  ActionIcon,
  MultiSelect,
  Menu,
  Stack,
  Select,
  Text,
} from "@mantine/core";
import { IconBug } from "@tabler/icons-react";
import { useState } from "react";
import { exam as _exam } from "./mocks/exam";

type Props = {
  exam: typeof _exam;
  currentQuestionIndex: number;
  changeIndex: (index: number) => void;
};

export function DebugHelper({
  exam,
  currentQuestionIndex,
  changeIndex,
}: Props) {
  const [modelsFilter, setModelsFilter] = useState<string[]>([]);

  return (
    <Menu
      shadow="md"
      width={400}
      style={{ position: "fixed", top: 10, left: 10, borderRadius: 10 }}
    >
      <Menu.Target>
        <ActionIcon variant="outline" color="blue">
          <IconBug size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Stack bg="white" p="xl" align="center">
          <Text color="dark.6" size="xs" weight={700}>
            ID Modelo: {exam.questions[currentQuestionIndex].model_id}
          </Text>

          <MultiSelect
            label="Filtrar questões"
            data={[...new Set(exam.questions.map((q) => q.model_id))].map(
              (model) => ({
                value: model,
                label: model,
              })
            )}
            onChange={(value) => setModelsFilter(value)}
            value={modelsFilter}
            w="100%"
          />

          <Select
            searchable
            label="Questão"
            data={exam.questions
              .filter((q) => {
                if (modelsFilter.length === 0) return true;
                return modelsFilter.includes(q.model_id);
              })
              .map((q, inx) => ({
                value: inx.toString(),
                label: `[${q.model_id}] (${q.id}) - ${q.description}`,
              }))}
            onChange={(value) => value && changeIndex(+value)}
            value={currentQuestionIndex.toString()}
            w="100%"
          />
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
