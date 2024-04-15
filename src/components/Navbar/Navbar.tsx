import {
  Anchor,
  Group,
  Image,
  Header as MantineHeader,
  MediaQuery,
  Text,
  createStyles,
} from "@mantine/core";
import logo from "~/assets/logos/eduedu-azul.svg";
import { useStudent } from "~/stores/student";
import { SCHOOL_GRADE, SCHOOL_PERIOD } from "../../constants";
import { BREAKPOINT } from "~/constants/dimensions";
import { useAuthLogout } from "~/api/auth";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/constants/path";
import { useUserStore } from "~/stores/user";

const useStyles = createStyles((theme) => ({
  logo: {
    display: "none",
    [theme.fn.largerThan(BREAKPOINT.TABLET_HORZ)]: {
      display: "block",
    },
  },
  header: {
    paddingInline: 140,
    [theme.fn.largerThan(BREAKPOINT.TABLET_HORZ)]: {
      justifyContent: "space-between",
    },
  },
  links: {
    alignItems: "baseline",
    [theme.fn.smallerThan(BREAKPOINT.TABLET_HORZ)]: {
      width: "100%",
      justifyContent: "center",
    },
  },
}));

export function Navbar() {
  const { classes } = useStyles();
  const student = useStudent();
  const userStore = useUserStore();
  const links = [
    { label: student?.name, value: "" },
    { label: "Matrícula", value: student?.registry },
    { label: "Série", value: student?.schoolClassName },
    { label: "Turma", value: SCHOOL_GRADE[student?.schoolGrade] },
    { label: "Período", value: SCHOOL_PERIOD[student?.schoolPeriod] },
  ] as const;

  const navigate = useNavigate();
  const { mutate: logout } = useAuthLogout({
    onSuccess: () => {
      useStudent.setState({}, true);
      userStore.signOut();
      navigate(PATH.LOGIN);
    },
  });

  return (
    <MantineHeader height={78} py={17}>
      <Group w="100%" noWrap h="100%" className={classes.header}>
        <Image
          src={logo}
          className={classes.logo}
          alt="EduEdu Escola"
          width={50}
        />

        <Group spacing={26} noWrap className={classes.links}>
          {links.map((link, i) => (
            <Group key={i} spacing={6}>
              <MediaQuery
                smallerThan={BREAKPOINT.TABLET_HORZ}
                styles={{ display: "none" }}
              >
                <Text color="dark.5" td="none" weight={600} size={14}>
                  {link.label}
                  {i !== 0 && ":"}
                </Text>
              </MediaQuery>
              {i === 0 && (
                <MediaQuery
                  largerThan={BREAKPOINT.TABLET_HORZ}
                  styles={{ display: "none" }}
                >
                  <Text color="dark.5" weight={700} size={16}>
                    {link.label}
                  </Text>
                </MediaQuery>
              )}
              <Text size={14}>{link.value}</Text>
            </Group>
          ))}
          <Anchor size="xs" onClick={() => logout({})}>
            (sair)
          </Anchor>
        </Group>
      </Group>
    </MantineHeader>
  );
}
