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
  Stack,
  Table,
  Text,
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
        <Stack
          spacing="xs"
          align="center"
        >
          <Text
            color="dark.4"
            weight={700}
            align="center"
          >
            {question.model_id}
          </Text>
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
          <Table fontSize={12}>
            <tbody>
              <tr>
                <td>Multipla escolha</td>
                <td>{question.multiplesAnswer ? "✅" : "❌"}</td>
              </tr>
              <tr>
                <td>Resposta ordenada</td>
                <td>{question.orderedAnswer ? "✅" : "❌"}</td>
              </tr>
              <tr>
                <td>Títulos</td>
                <td>{question.titles.length}</td>
              </tr>
              <tr>
                <td>Alternativas</td>
                <td>{question.options.length}</td>
              </tr>
            </tbody>
          </Table>
          <Badge variant="dot">{question.status ?? "N/A"}</Badge>
          <Anchor
            onClick={() => console.dir(question)}
            align="center"
            size="xs"
          >
            Logar objeto
          </Anchor>
          <Stack
            align="center"
            w="100%"
            spacing={4}
            my="md"
          >
            <Text
              color="dimmed"
              align="center"
              size="xs"
              weight={600}
            >
              Planeta: {question.planetTitle}
            </Text>
            <Text
              weight={600}
              color="dark.3"
            >
              {current} / {total - 1}
            </Text>
            <Progress
              value={progress}
              w="100%"
              striped
              color="teal"
              animate
            />
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
              onClick={() => value && onQuestionChange(+value)}
              size="sm"
              compact
              color="teal"
              fullWidth
            >
              Go
            </Button>
          </Stack>
        </Stack>
      </Drawer>
      <Group
        position="center"
        spacing={8}
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
          align="center"
          size="xs"
        >
          Anterior
        </Anchor>
        <Divider orientation="vertical" />
        <Anchor
          onClick={next}
          align="center"
          size="xs"
        >
          Próximo
        </Anchor>
      </Group>
    </>
  );
}
