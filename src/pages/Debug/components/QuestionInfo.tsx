import {
  Anchor,
  Badge,
  Button,
  CopyButton,
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { Question } from "~/api/exam";

export function QuestionInfo({
  question,
  next,
  previous,
}: {
  question: Question;
  next: () => void;
  previous: () => void;
}) {
  return (
    <Paper p="sm" withBorder shadow="md">
      <Stack spacing="xs">
        <Text color="dimmed" size={10} weight={700} align="center" w="100%">
          © MODEL INSPECTOR 7000 (beta)
        </Text>
        <Text color="dark.4" weight={700} align="center">
          {question.model_id}
        </Text>
        <CopyButton value={question.id.toString()}>
          {({ copied, copy }) => (
            <Button color={copied ? "teal" : "blue"} onClick={copy} size="xs">
              {copied ? "Copiado" : "Copiar ID"}
            </Button>
          )}
        </CopyButton>
        <Table fontSize={14}>
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
              <td>Nível</td>
              <td>{question.level}</td>
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
        <Group position="center">
          <Anchor onClick={previous} align="center" size="xs">
            Anterior
          </Anchor>
          <Divider orientation="vertical" />
          <Anchor onClick={next} align="center" size="xs">
            Próximo
          </Anchor>
        </Group>
        <Anchor onClick={() => console.dir(question)} align="center" size="xs">
          Logar objeto
        </Anchor>
      </Stack>
    </Paper>
  );
}
