import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/constants/path";
import { useDisclosure } from '@mantine/hooks';
import { useReserveStudent } from "~/api/school-class";
import { errorNotification } from "~/utils/errorNotification";
import { Stack, Grid, Group, Card, Text, Center, Pagination, Button, Flex, Box } from "@mantine/core"
import { ModalDuplicidadeLogin } from "./ModalDuplicidadeLogin";
import { useGetStudent } from "~/api/student";
import { IconLockOpen } from "@tabler/icons-react";

type componentsProps = {
    schoolClassId: string;
    students: { items: [], pagination: [] };
    updateStudentsList: any
}
export function Step03({ schoolClassId, students, updateStudentsList }: componentsProps) {
    const navigate = useNavigate();

    const [modal, modalHandler] = useDisclosure(false);

    const [studentId, setStudentId] = useState('')
    function logout(studentId: string) {
        setStudentId(studentId)
        modalHandler.open()
    }

    const { mutate: getStudentData } = useGetStudent({
        onError: (error) => {
            errorNotification(
                "Erro durante a operação",
                `${error.message} (cod: ${error.code})`
            );
        },
        onSuccess: () => {
            navigate(PATH.DASHBOARD)
        },
    })
    const { mutate: reserveStudent } = useReserveStudent({
        onError: (error) => {
            errorNotification(
                "Erro durante a operação",
                `${error.message} (cod: ${error.code})`
            );
        },
        onSuccess: () => { getStudentData(studentId) },
    })
    return (
        <>
            <Card py={20} px={40}>
                <Grid columns={4}>
                    {students?.items?.map((student) => (
                        <Grid.Col
                            key={student.id}
                            span={1}
                            style={{ height: '100%' }}

                        >
                            <Box style={{ position: 'relative' }}>
                                {student.reserved && (
                                    <IconLockOpen
                                        color="#228BE6"
                                        height={20}
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            zIndex: 1
                                        }}
                                    />
                                )}
                                <Button
                                    id={student.id}
                                    onClick={() => student.reserved ? logout(student.id) : setStudentId(student.id)}
                                    style={{
                                        display: 'flex',
                                        height: '100%',
                                        width: '100%',
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        border: student.reserved ? '1px solid #E9ECEF' : '1px solid #228BE6',
                                    }}
                                    styles={{
                                        root: {
                                            background: student.reserved ? '#E9ECEF' : '#FFF',
                                            "&:hover": {
                                                background: student.reserved ? '#B8BCC1' : '#E7F5FF'
                                            }
                                        }
                                    }}
                                >
                                    <Stack>
                                        <Text
                                            fz="lg"
                                            c={student.reserved ? 'gray.5' : 'blue.6'}
                                            style={{ lineHeight: 1 }}
                                        >
                                            {student.name}
                                        </Text>
                                        <Text
                                            fz="md"
                                            c={student.reserved ? 'gray.5' : 'gray.7'}
                                        >
                                            {student.registry}
                                        </Text>
                                    </Stack>
                                </Button>
                            </Box>
                        </Grid.Col>
                    ))}
                </Grid>
                <Center mt="20px">
                    <Pagination total={students?.pagination?.totalPages} />
                </Center>
            </Card>
            <Group position="right" mt="20px">
                <Button
                    onClick={() => reserveStudent({ id: schoolClassId, studentId: studentId })}
                    disabled={!studentId.length}
                    style={{ width: '157px' }}
                >
                    Entrar
                </Button>
            </Group>

            <ModalDuplicidadeLogin
                opened={modal}
                onClose={modalHandler.close}
                studentId={studentId}
                schoolClassId={schoolClassId}
                updateStudents={updateStudentsList}
            />
        </>
    )
}