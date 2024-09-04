import { createStyles } from "@mantine/core";
import { Student } from "~/api/student";
import { AcceptRoundBtn } from "~/components/icons/AcceptRoundBtn";
import { RefuseRoundBtn } from "~/components/icons/RefuseRoundBtn";
import { MEDIA_QUERY } from "~/constants/dimensions";
import titoTita from "~/assets/tito-e-tita.png";

const useStyles = createStyles(() => ({
  container: {
    backgroundColor: "#fff",
    transform: "scale(0)",
    opacity: 0,
    inset: 0,
    position: "absolute",
    isolation: "isolate",
    zIndex: 10,
    transition: "all 250ms ease-in-out",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    containerType: "inline-size",
    borderRadius: 40,
    padding: 40,
    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      padding: 84.5,
    },
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      flexDirection: "row",
    },
  },

  img: {
    maxWidth: "100%",
  },

  visible: {
    width: "90%",
    height: "fit-content",
    opacity: 1,
    transform: "scale(1)",
    margin: "auto",
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      width: "min(90%, 953px)",
    },
  },

  text: {
    fontSize: "min(20cqw, 40px)",
    fontWeight: "bold",
    color: "#000",
    margin: 0,
    span: {
      color: "#339AF0",
      lineHeight: 2,
    },
  },

  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "min(25cqw, 140px)",

    svg: { width: "min(20vw, 130px)" },
  },

  inner: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: 20,
  },
}));

type Props = {
  acceptCb: (accepted: boolean) => void;
  student?: Student;
};

export function StudentConfirmation({ acceptCb, student }: Props) {
  const { classes, cx } = useStyles();
  const visible = Boolean(student);

  return (
    <div className={cx([classes.container, visible && classes.visible])}>
      <img src={titoTita} className={classes.img} />

      <div className={classes.inner}>
        {student && (
          <h1 className={classes.text}>
            <span>Você é</span>
            <br />
            {student.name}?
          </h1>
        )}

        <div className={classes.controls}>
          <div onClick={() => acceptCb(false)}>
            <RefuseRoundBtn />
          </div>
          <div onClick={() => acceptCb(true)}>
            <AcceptRoundBtn />
          </div>
        </div>
      </div>
    </div>
  );
}
