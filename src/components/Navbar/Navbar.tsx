import {
  Group,
  Image,
  Header as MantineHeader,
  MediaQuery,
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
      // TODO: usar novos breakpoints
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
    { label: "Turma", value: SCHOOL_GRADE[student?.schoolGrade] ?? "" },
    { label: "Período", value: SCHOOL_PERIOD[student?.schoolPeriod] ?? "" },
  ] as const;

  return (
    <MantineHeader
      height={50}
      className={classes.base}
      onMouseLeave={onMouseLeave}
    >
      <Group
        w="100%"
        noWrap
        h="100%"
        className={classes.header}
      >
        <Image
          src={logo}
          className={classes.logo}
          alt="EduEdu Escola"
          height="90%"
          width="auto"
        />

        <Group
          spacing={26}
          noWrap
          className={classes.links}
        >
          {links.map((link, i) => (
            <Group
              key={i}
              spacing={6}
            >
              <MediaQuery
                smallerThan={BREAKPOINT.TABLET_HORZ}
                styles={{ display: "none" }}
              >
                <span className="text-gray-600 font-semibold text-sm no-underline">
                  {link.label}
                  {i !== 0 && ":"}
                </span>
              </MediaQuery>
              {i === 0 && (
                <MediaQuery
                  largerThan={BREAKPOINT.TABLET_HORZ}
                  styles={{ display: "none" }}
                >
                  <span className="text-gray-600 font-bold text-base">
                    {link.label}
                  </span>
                </MediaQuery>
              )}
              <span className="text-sm">{link.value}</span>
            </Group>
          ))}
          {student.id && <Logout />}
        </Group>
      </Group>
    </MantineHeader>
  );
}
