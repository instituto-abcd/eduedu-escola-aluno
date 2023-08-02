import { useStudent } from "~/stores/student";
import {
  Header as MantineHeader,
  Image,
  Text,
  Group,
  createStyles,
  Flex,
} from "@mantine/core";
import logo from "~/assets/logos/eduedu-azul.svg";
import { SCHOOL_GRADE, SCHOOL_PERIOD } from "../../constants";

const useStyles = createStyles({
  anchor: {
    textDecoration: "none",
    color: "inherit",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

export function Navbar() {
  const student = useStudent()
  const links = [
    { id: '1', label: student?.name, value: "" },
    { id: '2', label: "Matrícula", value: student?.registry },
    { id: '3', label: "Série", value: student?.schoolClassName },
    { id: '4', label: "Turma", value: SCHOOL_GRADE[student?.schoolGrade] },
    { id: '5', label: "Período", value: SCHOOL_PERIOD[student?.schoolPeriod] },
  ] as const;

  return (
    <MantineHeader
      height={78}
      styles={{
        root: {
          margin: "auto",
          display: "flex",
          justifyContent: "center",
        },
      }}
      py={17}
    >
      <Group
        maw={1200}
        w="100%"
        spacing={64}
        position="apart"
        noWrap
        align="center"
        h="100%"
        px={150}
      >
        <Image src={logo} alt="EduEdu Escola" width={50} mx={40} />

        <Group noWrap>
          <Group spacing={16}>
            {links.map((link) => (
              <Flex key={link.id}>
                <Text color="dark.5" td="none" weight={600} size={14} pr={10}>
                  {link.label}
                </Text>
                <Text size={14}>{link.value}</Text>
              </Flex>
            ))}
          </Group>
        </Group>
      </Group>
    </MantineHeader>
  );
}
