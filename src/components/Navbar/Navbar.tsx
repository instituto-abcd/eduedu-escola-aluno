import {
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
import { Logout } from "../Logout";

const useStyles = createStyles((theme, inView: boolean) => ({
  base: {
    position: "absolute",
    insetInline: 0,
    top: 0,
    transform: inView ? "none" : "translateY(-110%)",
    transition: "all 200ms ease-in-out",
  },

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

type Props = {
  inView: boolean;
  onMouseLeave: () => void;
};

export function Navbar({ inView, onMouseLeave }: Props) {
  const { classes } = useStyles(inView);
  const student = useStudent();
  const links = [
    { label: student?.name, value: "" },
    { label: "Matrícula", value: student?.registry },
    { label: "Série", value: student?.schoolClassName },
    { label: "Turma", value: SCHOOL_GRADE[student?.schoolGrade] },
    { label: "Período", value: SCHOOL_PERIOD[student?.schoolPeriod] },
  ] as const;

  return (
    <MantineHeader
      height={50}
      className={classes.base}
      onMouseLeave={onMouseLeave}
    >
      <Group w="100%" noWrap h="100%" className={classes.header}>
        <Image
          src={logo}
          className={classes.logo}
          alt="EduEdu Escola"
          height="90%"
          width="auto"
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
          <Logout />
        </Group>
      </Group>
    </MantineHeader>
  );
}
