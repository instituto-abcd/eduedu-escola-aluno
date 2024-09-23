import { Text, Anchor, Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { SchoolGrade, SchoolPeriod } from "~/api/school-class";
import { useStudentReserve } from "~/api/student";
import { PATH } from "~/constants/path";
import { useStudent } from "~/stores/student";

export function Logout() {
  const navigate = useNavigate();
  const student = useStudent();
  const { mutate, isLoading } = useStudentReserve({
    onSuccess: () => {
      student.update({
        id: "",
        name: "",
        registry: "",
        schoolClassId: "",
        schoolClassName: "",
        schoolGrade: "" as SchoolGrade,
        schoolPeriod: "" as SchoolPeriod,
        reserved: false,
        firstAccess: true,
        examPerformed: false,
      });

      navigate(PATH.LOGIN);
    },
  });

  const [open, handlers] = useDisclosure(false);

  return (
    <>
      <Anchor size="xs" onClick={handlers.toggle}>
        (sair)
      </Anchor>

      <Modal
        opened={isLoading || open}
        onClose={handlers.close}
        title="Confirmação"
      >
        <Text>
          Deseja realmente deslogar o perfil desse aluno e voltar para a área de
          login?
        </Text>
        <Group position="right">
          <Button
            variant="outline"
            color="gray"
            disabled={isLoading}
            onClick={handlers.close}
          >
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={() => mutate({ studentId: student.id, reserved: false })}
            loading={isLoading}
          >
            Sair
          </Button>
        </Group>
      </Modal>
    </>
  );
}
