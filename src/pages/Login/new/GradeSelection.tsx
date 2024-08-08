import { createStyles, getStylesRef } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { MEDIA_QUERY } from "~/constants/dimensions";
import bg from "~/assets/bg-select-option.png";
import { Character } from "~/components/Character";
import { useSearchParams } from "react-router-dom";
import { SchoolGrade } from "~/api/school-class";

const MAX_ITEMS = 6;

const useStyles = createStyles(() => ({
  container: {
    height: "100vh",
  },

  header: {
    width: "100%",
    paddingBlock: 8,
    paddingInline: 20,
    backgroundColor: "#000",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    height: 40,
    position: "relative",
    userSelect: "none",
    pointerEvents: "none",

    h1: {
      fontSize: 20,
      textAlign: "center",
    },

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      paddingBlock: 22,
      h1: {
        fontSize: 30,
      },
    },
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      position: "fixed",
      backgroundColor: "transparent",
      zIndex: 999,
    },
  },

  button: {
    border: 0,
    outline: 0,
    backgroundColor: "red",
    color: "white",
    borderRadius: "100%",
    display: "grid",
    placeItems: "center",
    padding: 6.5,
    boxSizing: "border-box",
    cursor: "pointer",
    position: "absolute",
    left: 16,
    margin: "auto",
    pointerEvents: "all",
    svg: {
      strokeWidth: 5,
    },
  },

  itemsContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      flexDirection: "row",
    },
  },

  item: {
    position: "relative",
    isolation: "isolate",
    minWidth: "100%",
    minHeight: `calc((100% - 40px) / ${MAX_ITEMS})`,
    containerType: "inline-size",
    color: "#F6A313",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "clip",
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      width: `calc(100vw / ${MAX_ITEMS})`,
      minWidth: "auto",
    },

    [`&:hover .${getStylesRef("character")}`]: {
      filter: "none",
      transform: "scale(1.1)",
    },

    p: {
      fontSize: "min( 10cqw, 40px )",
      fontWeight: "bold",
      maxWidth: "fit-content",
      margin: 0,
      lineHeight: 1,
      userSelect: "none",
      pointerEvents: "none",
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        fontSize: "min( 20cqw, 70px )",
      },
    },

    ".item_bg": {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "auto",
      zIndex: -2,
      filter: "grayscale(1)",
      transition: "filter 150ms ease",

      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        height: "100vh",
        width: "auto",
      },

      "&:hover": {
        filter: "none",
      },

      "&:nth-of-type(odd)": {},
    },
  },

  character: {
    ref: getStylesRef("character"),
    position: "absolute",
    marginLeft: "auto",
    top: 0,
    bottom: "auto",
    zIndex: -1,
    userSelect: "none",
    pointerEvents: "none",
    filter: "grayscale(1)",
    transition: "all 100ms ease",
    height: "160%",
    width: "auto",
    left: "76%",

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      height: "160%",
      width: "auto",
      left: "90%",
    },
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      right: "auto",
      left: "auto",
      top: "70%",
      minWidth: "130%",
      height: "auto",
    },
  },
}));

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function GradeSelection({ onBack, onNext }: Props) {
  const { classes } = useStyles();
  const [_, setQuery] = useSearchParams();

  function next(grade: SchoolGrade) {
    setQuery((prev) => {
      prev.set("schoolGrade", grade);
      return prev;
    });
    onNext();
  }

  const grades: Record<SchoolGrade, string> = {
    CHILDREN: "Infantil",
    FIRST_GRADE: "1º",
    SECOND_GRADE: "2º",
    THIRD_GRADE: "3º",
    FOURTH_GRADE: "4º",
    FIFTH_GRADE: "5º",
  } as const;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.button} onClick={onBack}>
          <IconX size={16} />
        </div>
        <h1>Qual o seu ano escolar?</h1>
      </div>

      <div className={classes.itemsContainer}>
        {(Object.keys(grades) as SchoolGrade[]).map((g, i) => (
          <div className={classes.item} key={g} onClick={() => next(g)}>
            <p>{grades[g]}</p>

            <Character id={i + 1} className={classes.character} />
            <img src={bg} alt="" role="presentation" className="item_bg" />
          </div>
        ))}
      </div>
    </div>
  );
}
