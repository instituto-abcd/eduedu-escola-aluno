import { useState } from "react";
import { useSchoolClassesAllMutation } from "~/api/user";
import { useStudentsBySchoolclass } from "~/api/school-class";
import { errorNotification } from "~/utils/errorNotification";
import {
  BackgroundImage,
  Image,
  Box,
  Center,
  TextInput,
  Select,
  Flex,
} from "@mantine/core";
import logo from "~/assets/logos/eduedu-branca.svg";
import bg from "~/assets/bgs/bg-aluno.svg";
import { Step01 } from "./components/Step01";
import { Step02 } from "./components/Step02";
import { Step03 } from "./components/Step03";

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

  // Students:
  const [students, setStudents] = useState([]);
  const { mutate: studentsList } = useStudentsBySchoolclass({
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      );
    },
    onSuccess: (data) => { setStudents(data) },
  });

  // Managing data received from childs:
  function getDataFromChild(step: number, schoolClassIdChild: string) {
    nextStep(step);
    setSchoolClassId(schoolClassIdChild);
    step == 2 ? getSchoolClasses() : {};
    step == 3 ? studentsList({ id: schoolClassIdChild }) : {};
  }
  function updateList() {
    studentsList({ id: schoolClassId })
  }

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
                styles={{
                  label: { color: "#fff", marginBottom: 6 },
                }}
              />
            )}
          </Flex>
          {step == 1 && <Step01 sendToFather={getDataFromChild} />}
          {step == 2 && (
            <Step02
              schoolClasses={schoolClassesOptions}
              sendToFather={getDataFromChild}
            />
          )}
          {step == 3 && (
            <Step03
              schoolClassId={schoolClassId}
              students={students}
              updateStudentsList={updateList}
            />
          )}
        </Box>
      </Center>
    </BackgroundImage>
  );
}
