import { Modal, Group, Text, Button, Stack, Divider } from "@mantine/core";
import { useUnreserveStudent } from "~/api/school-class";
import { errorNotification } from "~/utils/errorNotification";
import { successNotification } from "~/utils/successNotification";

type Props = {
    opened: boolean;
    onClose(): void;
    schoolClassId: string;
    studentId: string;
    updateStudents: any
};

export function ModalDuplicidadeLogin({ opened, onClose, schoolClassId, studentId, updateStudents }: Props) {
    const { mutate: logoutStudent } = useUnreserveStudent({
        onError: (error) => {
            errorNotification(
                "Erro durante a operação",
                `${error.message} (cod: ${error.code})`
            );
        },
        onSuccess: () => {
            successNotification("Sucesso na operação", "Aluno desconectado")
            onClose()
            updateStudents()
        },
    })

    return (
        <Modal
            title="Atenção - Duplicidade de Login"
            opened={opened}
            onClose={onClose}
            radius="md"
        >
            <Stack>
                <Text size="sm">
                    Essa ação vai desativar o login anterior.
                    O aluno selecionado está ativo em outro computador.
                </Text>
                <Text size="sm">
                    Deseja continuar?
                </Text>
                <Divider />
                <Group position="right">
                    <Button variant="outline" onClick={() => onClose()}>Não</Button>
                    <Button onClick={() => logoutStudent({ id: schoolClassId, studentId: studentId })}>Sim</Button>
                </Group>
            </Stack>
        </Modal>
    )
}