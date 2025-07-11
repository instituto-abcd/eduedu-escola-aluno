import {
  Title,
  SimpleGrid,
  Paper,
  Text,
  Badge,
  Table,
  MultiSelect,
} from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebugQuestions } from "~/api/debug";

export function QuestionListPage() {
  const { data } = useDebugQuestions({ initialData: [] });
  const [filter, setFilter] = useState<string[]>([]);

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="flex flex-col gap-0 justify-center items-center">
        <Title
          color="dark.4"
          order={1}
        >
          Questões de Prova
        </Title>
        {data && <Text color="dark.4">Total de questões: {data.length}</Text>}
      </div>

      {data && (
        <div className="my-8">
          <MultiSelect
            data={[...new Set(data.map((q) => q.model_id))].map((id) => ({
              value: id,
              label: id,
            }))}
            label="Filtrar modelos"
            value={filter}
            onChange={setFilter}
          />
        </div>
      )}

      <SimpleGrid cols={7}>
        {data
          ?.filter((q) =>
            filter.length > 0 ? filter.includes(q.model_id) : true
          )
          .map((question) => (
            <Paper
              key={question.id}
              withBorder
              radius="md"
              shadow="sm"
              p="md"
              component={Link}
              to={question.id.toString()}
              state={{ question }}
            >
              <div className="flex flex-col items-center">
                <div className="flex w-full justify-between items-center">
                  <Text
                    color="dark.3"
                    weight={700}
                  >
                    {question.model_id}
                  </Text>
                  <Badge size="xs">{question.axis_code ?? "N/A"}</Badge>
                </div>

                <Badge
                  fullWidth
                  color="grape"
                >
                  ID: {question.id ?? "N/A"}
                </Badge>
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
              </div>
            </Paper>
          ))}
      </SimpleGrid>
    </div>
  );
}
