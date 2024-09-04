import {
  BackgroundImage,
  Button,
  Card,
  Center,
  Group,
  Stack,
  createStyles,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReserveStudent,
  useStudentsBySchoolclass,
} from "~/api/school-class";
import { useUserSchoolClasses } from "~/api/user";
import bg from "~/assets/bgs/bg-aluno.svg";
import { Pagination } from "~/components/Pagination";
import { PATH } from "~/constants/path";
import { usePagination } from "~/hooks/usePagination";
import { useStudent } from "~/stores/student";
import { onError } from "~/utils/errorNotification";
import { StudentSelectionGrid } from "./_deprecated_components/StudentSelectionGrid";
import { ClassHandles } from "./_deprecated_components/ClassHandles";
import { BREAKPOINT } from "~/constants/dimensions";
import { LoginForm } from "./_deprecated_components/LoginForm";
import { ClassSelection } from "./_deprecated_components/ClassSelection";

const useStyles = createStyles((theme) => ({
  column: {
    gap: 24,
    width: "auto",
    [theme.fn.smallerThan(BREAKPOINT.DESKTOP)]: {
      width: 668,
    },
  },
}));

export function LoginPage() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const nextStep = () => (step < 3 ? setStep(step + 1) : null);

  /* 2. Selecionar turma */
  const [selectedClass, setSelectedClass] = useState("");
  const { data: schoolClasses } = useUserSchoolClasses({
    enabled: step > 1,
    onError,
  });

  useEffect(() => {
    studentPagination.setPage(1);
  }, [selectedClass]);

  /* 3. Selecionar aluno */
  const [studentSearch, setStudentSearch] = useDebouncedState("", 400);
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
  const { mutate: reserveStudent } = useReserveStudent({
    onError,
    onSuccess: (_, vars) => {
      const student = studentsList?.items.find(
        (student) => student.id === vars.studentId,
      );
      if (!student) return;

      useStudent.setState({ ...student });

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

  return (
    <BackgroundImage src={bg} h="100vh" w="100vw">
      <Center w="100%" maw={1620} h="100%" mx="auto">
        <Stack className={classes.column}>
          {step === 3 && (
            <ClassHandles
              onSearch={(value) => {
                setStudentSearch(value);
                studentPagination.setPage(1);
              }}
              onClassChange={setSelectedClass}
              selectedClass={selectedClass}
            />
          )}

          {/* Autenticar professor */}
          {step === 1 && <LoginForm onNextStep={nextStep} />}

          {/* Selecionar turma */}
          {step === 2 && (
            <ClassSelection
              schoolClasses={schoolClasses}
              onNextStep={nextStep}
              onClassSelected={setSelectedClass}
              selectedClass={selectedClass}
            />
          )}

          {/* Grid de alunos */}
          {step === 3 && (
            <Stack spacing={24}>
              <Card radius={8} shadow="md">
                <StudentSelectionGrid
                  schoolClass={selectedClass}
                  students={studentsList}
                  onSelect={setSelectedStudent}
                  onLogout={refetchStudents}
                  loading={loadingStudents}
                />

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
        </Stack>
      </Center>
    </BackgroundImage>
  );
}
