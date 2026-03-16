import {
  Title,
  SimpleGrid,
  Paper,
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
          c="dark.4"
          order={1}
        >
          Questões de Prova
        </Title>
        {data && (
          <span className="text-gray-600">
            Total de questões: {data.length}
          </span>
        )}
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
                  <span className="text-gray-700 font-bold">
                    {question.model_id}
                  </span>
                  <Badge size="xs">{question.axis_code ?? "N/A"}</Badge>
                </div>

                <Badge
                  fullWidth
                  color="grape"
                >
                  ID: {question.id ?? "N/A"}
                </Badge>
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
              </div>
            </Paper>
          ))}
      </SimpleGrid>
    </div>
  );
}
