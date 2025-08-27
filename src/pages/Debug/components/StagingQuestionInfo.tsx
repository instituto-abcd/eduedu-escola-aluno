import { Button, CopyButton, Paper, Table } from "@mantine/core";
import { useOs, useViewportSize } from "@mantine/hooks";
import { IconCircleCheck, IconCopy } from "@tabler/icons-react";
import { Question } from "~/api/exam";
import { useStudent } from "~/stores/student";
import { useNetwork } from "@mantine/hooks";
import { SCHOOL_GRADE, SCHOOL_PERIOD } from "~/constants";
import packageJson from "~/../package.json";

export function StagingQuestionInfo({ question }: { question: Question }) {
  const student = useStudent();
  const dimensions = useViewportSize();
  const network = useNetwork();
  const os = useOs();

  const copyInfo = `--- Informações da Questão ---
ID da Questão: "${question.id}"
ID do Modelo: ${question.model_id}
ID do Planeta: "${question.planet_id ?? "N/A"}"
Nome do Planeta: ${question.planetTitle ?? "N/A"}
Index da Questão: N/A

--- Informações do Aluno ---
Nome do aluno: ${student.name ?? "N/A"}
ID da turma: "${student.schoolClassId ?? "N/A"}"
Nome da turma: ${student.schoolClassName ?? "N/A"}
Ano escolar: ${SCHOOL_GRADE[student.schoolGrade] ?? "N/A"}
Período escolar: ${SCHOOL_PERIOD[student.schoolPeriod] ?? "N/A"}

--- Informações do Dispositivo ---
Dimensões da tela: ${dimensions.width}x${dimensions.height}
Sistema operacional: ${os ?? "N/A"}

--- Informações da Rede ---
Velocidade estimada da internet: ${network.effectiveType ?? "N/A"}
Tipo de conexão: ${network.type ?? "N/A"}

--- Versão do sistema (front-end) ---
${import.meta.env.MODE} - ${packageJson.version}
`;

  return (
    <Paper
      p="sm"
      withBorder
      shadow="md"
      style={{ minWidth: 160 }}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="text-gray-500 text-xs font-bold">
          Dados da Questão
        </span>

        <Table
          fontSize={12}
          withBorder
        >
          <tbody>
            <tr>
              <td>Modelo</td>
              <td>{question.model_id}</td>
            </tr>
            <tr>
              <td>Planeta</td>
              <td>{question.planetTitle ?? "❌"}</td>
            </tr>
          </tbody>
        </Table>
        <CopyButton value={copyInfo}>
          {({ copied, copy }) => (
            <Button
              color={copied ? "teal" : "blue"}
              onClick={copy}
              size="xs"
              variant="outline"
              compact
              w="min-content"
              leftIcon={
                copied ? <IconCircleCheck size={16} /> : <IconCopy size={16} />
              }
            >
              {copied ? "Copiado" : "Copiar"}
            </Button>
          )}
        </CopyButton>
      </div>
    </Paper>
  );
}
