import { useEffect, useState } from "react";
import { useUserSchoolClasses } from "~/api/user";
import {
  useReserveStudent,
  useStudentsBySchoolclass,
  useUnreserveStudent,
} from "~/api/school-class";
import { errorNotification } from "~/utils/errorNotification";
import {
  BackgroundImage,
  Image,
  Box,
  Center,
  Select,
  Card,
  Button,
  Stack,
  Text,
  Group,
  PasswordInput,
  SimpleGrid,
  Divider,
  Modal,
  TextInput,
} from "@mantine/core";
import logo from "~/assets/logos/eduedu-branca.svg";
import bg from "~/assets/bgs/bg-aluno.svg";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { Pagination } from "~/components/Pagination";
import { usePagination } from "~/hooks/usePagination";
import { useForm } from "@mantine/form";
import { ApiError } from "~/api/api-types";
import { useAuthLogin } from "~/api/auth";
import { StudentGridCard } from "~/components/StudentGridCard/StudentGridCard";
import { successNotification } from "~/utils/successNotification";
import { PATH } from "~/constants/path";

export function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const nextStep = () => (step < 3 ? setStep(step + 1) : null);

  const onError = (error: ApiError) =>
    errorNotification(
      "Erro durante a operação",
      `${error.message} (cod: ${error.code})`
    );

  /* 1. Logar professor */
  const {
    mutate: authTeacher,
    isSuccess: authSuccess,
    isLoading: isAuthenticating,
  } = useAuthLogin({
    onError,
    onSuccess: nextStep,
  });

  const authForm = useForm({
    initialValues: {
      accessKey: "",
    },
  });

  /* 2. Selecionar turma */
  const [selectedClass, setSelectedClass] = useState("");
  const { data: schoolClasses } = useUserSchoolClasses({
    enabled: authSuccess,
    onError,
  });

  useEffect(() => {
    studentPagination.setPage(1);
  }, [selectedClass]);

  /* 3. Selecionar aluno */
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const studentPagination = usePagination();
  const {
    data: studentsList,
    refetch: refetchStudents,
    isLoading: loadingStudents,
  } = useStudentsBySchoolclass(selectedClass, {
    enabled: !!selectedClass,
    onError,
    search: { name: studentSearch },
    page: studentPagination.page,
    pageSize: studentPagination.pageSize,
  });

  /* 4. Reservar aluno */
  const { mutate: reserveStudent, isSuccess: reserveSuccess } =
    useReserveStudent({
      onError,
      onSuccess: (_, vars) => {
        const student = studentsList?.items.find(
          (student) => student.id === vars.studentId
        );
        if (!student) return;

        if (student.firstAccess == true) {
          navigate(PATH.INTRO);
        } else if (
          student.firstAccess == false &&
          student.examPerformed == false
        ) {
          navigate(PATH.EXAM);
        } else {
          navigate(PATH.DASHBOARD);
        }
      },
    });

  /* 5. Liberar aluno */
  const { mutate: logoutStudent } = useUnreserveStudent({
    onError,
    onSuccess: () => {
      successNotification("Sucesso na operação", "Aluno desconectado");
      modalHandlers.close();
      void refetchStudents();
    },
  });

  const [isModelOpen, modalHandlers] = useDisclosure(false);
  const [freeStudent, setFreeStudent] = useState<string>();

  function logout(studentId: string) {
    setFreeStudent(studentId);
    modalHandlers.open();
  }

  return (
    <BackgroundImage src={bg} h="100vh" w="100vw">
      <Center maw={1200} h="100%" mx="auto">
        <Box sx={{ minWidth: "100%" }}>
          {step === 1 && (
            <form
              onSubmit={authForm.onSubmit((values) => {
                authTeacher(values);
              })}
            >
              <Stack w={400} m="auto">
                <PasswordInput
                  {...authForm.getInputProps("accessKey")}
                  label="Código de acesso"
                  placeholder="Digite o código de acesso"
                  styles={{
                    label: { color: "#fff", marginBottom: 6 },
                  }}
                />
                <Button
                  type="submit"
                  disabled={!authForm.values.accessKey}
                  fullWidth
                  loading={isAuthenticating}
                >
                  Entrar
                </Button>
              </Stack>
            </form>
          )}

          {step === 2 && (
            <Stack w={400} m="auto">
              <Select
                label="Turma"
                placeholder="Selecione"
                data={
                  schoolClasses?.map((schoolClass) => ({
                    value: schoolClass.id,
                    label: schoolClass.name,
                  })) ?? []
                }
                styles={{
                  label: { color: "#fff", marginBottom: 6 },
                }}
                onChange={(value) => value && setSelectedClass(value)}
              />
              <Button
                disabled={!selectedClass}
                fullWidth
                onClick={() => nextStep()}
              >
                Entrar
              </Button>
            </Stack>
          )}

          {step === 3 && (
            <Stack spacing={24}>
              <Group position="apart" align="flex-end">
                <Select
                  label="Turma"
                  placeholder="Selecione"
                  onChange={(value) => value && setSelectedClass(value)}
                  value={selectedClass}
                  data={
                    schoolClasses?.map((schoolClass) => ({
                      value: schoolClass.id,
                      label: schoolClass.name,
                    })) ?? []
                  }
                  styles={{
                    label: { color: "#fff", marginBottom: 6 },
                  }}
                  style={{ flexGrow: 1 }}
                />
                <Image
                  maw={180}
                  mb={32}
                  mx={110}
                  radius="md"
                  src={logo}
                  alt="Logo EduEdu Escola"
                />
                <TextInput
                  label="Nome"
                  placeholder="Pesquisar"
                  onChange={(e) => setStudentSearch(e.target.value)}
                  styles={{
                    label: { color: "#fff", marginBottom: 6 },
                  }}
                  style={{ flexGrow: 1 }}
                />
              </Group>
              <Card py={20} px={40} radius={8} shadow="md">
                <SimpleGrid cols={4}>
                  {studentsList?.items.map((student) => (
                    <StudentGridCard
                      key={student.id}
                      student={student}
                      onLogout={(studentId) => logout(studentId)}
                      onSelected={() => setSelectedStudent(student.id)}
                      selected={selectedStudent === student.id}
                    />
                  ))}
                </SimpleGrid>

                <Center mt="20px">
                  {studentsList && (
                    <Pagination
                      paginationApi={studentsList.pagination}
                      paginationHook={studentPagination}
                    />
                  )}
                </Center>
              </Card>

              <Group position="right" mt="20px">
                <Button
                  onClick={() =>
                    reserveStudent({
                      id: selectedClass,
                      studentId: selectedStudent,
                    })
                  }
                  disabled={!selectedStudent}
                  style={{ width: "157px" }}
                >
                  Entrar
                </Button>
              </Group>
            </Stack>
          )}
        </Box>
      </Center>

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
                logoutStudent({ id: selectedClass, studentId: freeStudent })
              }
            >
              Sim
            </Button>
          </Group>
        </Stack>
      </Modal>
    </BackgroundImage>
  );
}
