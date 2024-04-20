import {
  Button,
  Text,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  SimpleGridBreakpoint,
  Stack,
  Skeleton,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Paginated } from "~/api/api-types";
import { SimplifiedStudent, useUnreserveStudent } from "~/api/school-class";
import { StudentGridCard } from "~/components/StudentGridCard/StudentGridCard";
import { BREAKPOINT } from "~/constants/dimensions";
import { onError } from "~/utils/errorNotification";
import { successNotification } from "~/utils/successNotification";

type Props = {
  students?: Paginated<SimplifiedStudent>;
  onSelect: (studentId: string) => void;
  onLogout: () => void;
  schoolClass: string;
  loading: boolean;
};

export function StudentSelectionGrid({
  onSelect,
  onLogout,
  schoolClass,
  students,
  loading,
}: Props) {
  const [highlighted, setHighlight] = useState<string>();

  useEffect(() => {
    if (highlighted) onSelect(highlighted);
  }, [highlighted]);

  const gridBreakpointsConfig: SimpleGridBreakpoint[] = [
    { minWidth: BREAKPOINT.TABLET_HORZ, cols: 3 },
    { minWidth: BREAKPOINT.DESKTOP, cols: 4 },
    { minWidth: BREAKPOINT.TV, cols: 6 },
  ];

  const { mutate: logoutStudent } = useUnreserveStudent({
    onError,
    onSuccess: () => {
      successNotification("Sucesso na operação", "Aluno desconectado");
      modalHandlers.close();
      onLogout();
    },
  });

  const [isModelOpen, modalHandlers] = useDisclosure(false);
  const [freeStudent, setFreeStudent] = useState<string>();

  function logout(studentId: string) {
    setFreeStudent(studentId);
    modalHandlers.open();
  }

  const SKEL_AMOUNT = 12;

  return (
    <>
      <SimpleGrid cols={2} breakpoints={gridBreakpointsConfig} spacing="md">
        {students?.items
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((student) => (
            <StudentGridCard
              key={student.id}
              student={student}
              onLogout={(studentId) => logout(studentId)}
              onSelected={() => setHighlight(student.id)}
              selected={highlighted === student.id}
            />
          ))}

        {loading &&
          Array(SKEL_AMOUNT)
            .fill(null)
            .map((_, inx) => (
              <Skeleton
                key={inx}
                height={68}
                style={{ minWidth: 199 }}
                width="100%"
                radius="md"
              />
            ))}
      </SimpleGrid>

      {students?.items.length === 0 && (
        <Title ta="center" color="dimmed" my={100}>
          Sem alunos nesta turma.
        </Title>
      )}

      <Modal
        title="Atenção - Duplicidade de Login"
        opened={isModelOpen}
        onClose={modalHandlers.close}
        radius="md"
      >
        <Stack>
          <Text size="sm">
            Essa ação vai desativar o login anterior. O aluno selecionado está
            ativo em outro computador.
          </Text>
          <Text size="sm">Deseja continuar?</Text>
          <Divider />
          <Group position="right">
            <Button variant="outline" onClick={modalHandlers.close}>
              Não
            </Button>
            <Button
              onClick={() =>
                freeStudent &&
                logoutStudent({ id: schoolClass, studentId: freeStudent })
              }
            >
              Sim
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export function StudentGridLoader() {
  return <Skeleton height={68} width={"100%"} radius="md" />;
}
