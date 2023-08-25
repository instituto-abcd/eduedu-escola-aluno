import { useState } from "react";
import { useSchoolClassesAllMutation } from "~/api/user";
import { useReserveStudent, useStudentsBySchoolclass } from "~/api/school-class";
import { errorNotification } from "~/utils/errorNotification";
import {
  BackgroundImage,
  Image,
  Box,
  Center,
  TextInput,
  Select,
  Flex,
  Card,
  Grid,
  Button,
  Stack,
  Text,
  Group
} from "@mantine/core";
import logo from "~/assets/logos/eduedu-branca.svg";
import bg from "~/assets/bgs/bg-aluno.svg";
import { Step01 } from "./components/Step01";
import { Step02 } from "./components/Step02";
import { Step03 } from "./components/Step03";
import { IconLockOpen } from "@tabler/icons-react";
import { ModalDuplicidadeLogin } from "./components/ModalDuplicidadeLogin";
import { useDisclosure } from "@mantine/hooks";
import { Student, useGetStudent } from "~/api/student";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/constants/path";
import { Pagination } from "~/components/Pagination";
import { usePagination } from "~/hooks/usePagination";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { Paginated } from "~/api/api-types";

export function LoginPage() {
  // Controlling steps:
  const [step, setStep] = useState(1);
  function nextStep(step: number) {
    setStep(step);
  }

  // SchoolClasses:
  const [schoolClassId, setSchoolClassId] = useState("");
  const [schoolClassesOptions, setSchoolClassesOptions] = useState([]);
  const { mutate: getSchoolClasses } = useSchoolClassesAllMutation({
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      );
    },
    onSuccess: (data) => {
      let sc = data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [];
      setSchoolClassesOptions(sc)
    },
  });

  const formValidation = z.object({
    id: z.string().min(1, "Selecione uma turma")
  })
  const form = useForm({
    initialValues: {
      id: ''
    },
    validate: zodResolver(formValidation)
  })

  // Students:
  // const [students, setStudents] = useState([]);
  const [studentsFilter, setStudentsFilter] = useState<Paginated<Student[]>>();
  const { data: studentsList } = useStudentsBySchoolclass(form.values.id, {
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      );
    },
    onSuccess: (data) => {
      setStudentsFilter(data)
    },
  });

  // Managing data received from childs:
  function getDataFromChild(step: number, schoolClassIdChild: string) {
    nextStep(step);
    setSchoolClassId(schoolClassIdChild);
    step == 2 ? getSchoolClasses() : {};
    step == 3 ? studentsList({ id: schoolClassIdChild }) : {};
  }
  function updateList() { studentsList({ id: schoolClassId }) }
  
  function filterStudents(inputValue) {
    let filterBy = inputValue.replace(/\s/g, '').toLowerCase();
    let result = studentsFilter.items.filter((item) =>
      (new RegExp(filterBy)).test(item['name'].replace(/\s/g, '').toLowerCase())
    )
    setStudentsFilter({ items: result })
  }

  const [studentId, setStudentId] = useState("");
  const [studentFirstAccess, setStudentFirstAccess] = useState(false);
  const [studentExamPerformed, setStudentExamPerformed] = useState(false);

  const navigate = useNavigate();
  const { mutate: getStudentData } = useGetStudent({
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      );
    },
    onSuccess: () => {
      if (studentFirstAccess == true) {
        navigate(PATH.INTRO);
      } else if (studentFirstAccess == false && studentExamPerformed == false) {
        navigate(PATH.EXAM);
      } else {
        navigate(PATH.DASHBOARD);
      }
    },
  });

  const { mutate: reserveStudent } = useReserveStudent({
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      );
    },
    onSuccess: () => {
      getStudentData(studentId);
    },
  });

  const [modal, modalHandler] = useDisclosure(false);
  function logout(studentId: string) {
    setStudentId(studentId);
    modalHandler.open();
  }

  const pagination = usePagination();

  return (
    <BackgroundImage src={bg} h="100vh" w="100vw">
      <Center maw={1200} h="100%" mx="auto">
        <Box sx={{ minWidth: "100%" }}>
          <Flex>
            {step == 3 && (
              <Select
                mt="auto"
                mb="50px"
                label="Turma"
                placeholder="Selecione"
                onChange={(value) => {
                  setSchoolClassId(value)
                  studentsList({ id: value })
                }}
                value={schoolClassId ? schoolClassId : ""}
                data={schoolClassesOptions}
                styles={{
                  label: { color: "#fff", marginBottom: 6 },
                }}
              />
            )}
            <Image
              maw={180}
              mb={50}
              mx="auto"
              radius="md"
              src={logo}
              alt="Logo EduEdu Escola"
            />
            {step == 3 && (
              <TextInput
                mt="auto"
                mb="50px"
                label="Nome"
                placeholder="Pesquisar"
                onChange={(input) => filterStudents(input.target.value)}
                styles={{
                  label: { color: "#fff", marginBottom: 6 },
                }}
              />
            )}
          </Flex>
          {step == 1 && <Step01 sendToFather={getDataFromChild} />}
          {step == 2 && (
            // <Step02
            //   schoolClasses={schoolClassesOptions}
            //   sendToFather={getDataFromChild}
            // />
            <Stack w={400} m="auto">
              <form onSubmit={form.onSubmit((schoolClass) => { getDataFromChild(3, schoolClass.id) })}>
                  <Select
                      {...form.getInputProps('id')}
                      label="Turma"
                      placeholder={schoolClassesOptions.length ? "Selecione" : "Sem turmas disponíveis"}
                      data={schoolClassesOptions}
                      styles={{
                          label: { color: "#fff", marginBottom: 6 },
                      }}
                  />
                  <Button
                      type="submit"
                      disabled={!form.isValid()}
                      fullWidth
                      mt={20}
                  >
                      Entrar
                  </Button>
              </form>
            </Stack>
          )}
          {step == 3 && (
            <>
              <Card py={20} px={40}>
                <Grid columns={4}>
                  {studentsFilter?.items?.map((student) => (
                    <Grid.Col key={student.id} span={1} style={{ height: "100%" }}>
                      <Box style={{ position: "relative" }}>
                        {student.reserved && (
                          <IconLockOpen
                            color="#228BE6"
                            height={20}
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              zIndex: 1,
                            }}
                          />
                        )}
                        <Button
                          id={student.id}
                          onClick={() =>
                            student.reserved
                              ? logout(student.id)
                              : (setStudentId(student.id),
                                setStudentFirstAccess(student.firstAccess),
                                setStudentExamPerformed(student.examPerformed))
                          }
                          style={{
                            display: "flex",
                            height: "100%",
                            width: "100%",
                            padding: "10px 20px",
                            borderRadius: "12px",
                            border: student.reserved
                              ? "1px solid #E9ECEF"
                              : "1px solid #228BE6",
                          }}
                          styles={{
                            root: {
                              background: student.reserved
                                ? "#E9ECEF"
                                : student.id == studentId
                                  ? "#E7F5FF"
                                  : "#FFF",
                              "&:hover": {
                                background: student.reserved ? "#B8BCC1" : "#E7F5FF",
                              },
                            },
                          }}
                        >
                          <Stack>
                            <Text
                              fz="lg"
                              c={student.reserved ? "gray.5" : "blue.6"}
                              style={{ lineHeight: 1 }}
                            >
                              {student.name}
                            </Text>
                            <Text fz="md" c={student.reserved ? "gray.5" : "gray.7"}>
                              {student.registry}
                            </Text>
                          </Stack>
                        </Button>
                      </Box>
                    </Grid.Col>
                  ))}
                </Grid>
                <Center mt="20px">
                  {/* <Pagination total={students?.pagination?.totalPages} /> */}
                  {studentsFilter && (
                    <Pagination
                      paginationApi={studentsFilter?.pagination ?? {}}
                      paginationHook={pagination}
                    />
                  )}
                </Center>
              </Card>
              <Group position="right" mt="20px">
                <Button
                  onClick={() =>
                    reserveStudent({ id: schoolClassId, studentId: studentId })
                  }
                  disabled={!studentId.length}
                  style={{ width: "157px" }}
                >
                  Entrar
                </Button>
              </Group>

              <ModalDuplicidadeLogin
                opened={modal}
                onClose={modalHandler.close}
                studentId={studentId}
                schoolClassId={schoolClassId}
                updateStudents={updateList}
              />
            </>
          )}
        </Box>
      </Center>
    </BackgroundImage>
  );
}
function getStudentData(studentId: any) {
  throw new Error("Function not implemented.");
}

