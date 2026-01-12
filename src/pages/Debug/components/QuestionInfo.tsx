import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  CopyButton,
  Divider,
  Drawer,
  Group,
  NumberInput,
  Progress,
  Select,
  Table,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Question } from "~/api/exam";

export function QuestionInfo({
  questions,
  next,
  previous,
  current,
  total,
  onQuestionChange,
}: {
  questions: Question[];
  next: () => void;
  previous: () => void;
  current: number;
  total: number;
  onQuestionChange: (index: number) => void;
}) {
  const [opened, handlers] = useDisclosure(false);
  const progress = (current / (total - 1)) * 100;
  const [jumper, setJumper] = useState<number>();
  const question = questions[current];

  const [value, setValue] = useState<string | null>(current.toString());

  useEffect(() => {
    setValue(current.toString());
  }, [current]);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handlers.close}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-600 font-bold text-center">
            {question.model_id}
          </span>
          <CopyButton value={question.id.toString()}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                size="xs"
              >
                {copied ? "Copiado" : "Copiar ID da Questão"}
              </Button>
            )}
          </CopyButton>
          <Table fz={12}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Multipla escolha</Table.Td>
                <Table.Td>{question.multiplesAnswer ? "✅" : "❌"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Resposta ordenada</Table.Td>
                <Table.Td>{question.orderedAnswer ? "✅" : "❌"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Títulos</Table.Td>
                <Table.Td>{question.titles.length}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Alternativas</Table.Td>
                <Table.Td>{question.options.length}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Badge variant="dot">{question.status ?? "N/A"}</Badge>
          <Anchor
            onClick={() => console.dir(question)}
            ta="center"
            size="xs"
          >
            Logar objeto
          </Anchor>
          <div className="flex flex-col items-center w-full gap-1 my-4">
            <span className="text-gray-500 text-center text-xs font-semibold">
              Planeta: {question.planetTitle}
            </span>
            <span className="font-semibold text-gray-700">
              {current} / {total - 1}
            </span>
            <Progress
              value={progress}
              w="100%"
              striped
              color="teal"
              animated
            />
          </div>

          <Group>
            <NumberInput
              value={jumper}
              onChange={(v) => setJumper(+v)}
              size="xs"
              min={0}
              max={total}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  Number.isInteger(jumper) &&
                    onQuestionChange(jumper as number);
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
          <div className="flex flex-col items-end">
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
              onClick={() => value && onQuestionChange(+value)}
              size="compact-sm"
              color="teal"
              fullWidth
            >
              Go
            </Button>
          </div>
        </div>
      </Drawer>
      <Group
        justify="center"
        gap={8}
      >
        <ActionIcon
          variant="filled"
          color="blue"
          radius="xl"
          onClick={handlers.toggle}
        >
          <IconAdjustments size={20} />
        </ActionIcon>
        <Divider orientation="vertical" />
        <Anchor
          onClick={previous}
          ta="center"
          size="xs"
        >
          Anterior
        </Anchor>
        <Divider orientation="vertical" />
        <Anchor
          onClick={next}
          ta="center"
          size="xs"
        >
          Próximo
        </Anchor>
      </Group>
    </>
  );
}
