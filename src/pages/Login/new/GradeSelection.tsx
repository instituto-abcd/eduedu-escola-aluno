import { createStyles, getStylesRef } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { MEDIA_QUERY } from "~/constants/dimensions";
import bg from "~/assets/bg-select-option.png";
import { Character } from "~/components/Character";
import { useSearchParams } from "react-router-dom";
import { SchoolGrade, useSchoolGradeCount } from "~/api/school-class";
import { SCHOOL_GRADE } from "~/constants";

const MAX_ITEMS = 6;

const useStyles = createStyles((_, grades: number) => ({
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
    minHeight: `calc((100% - 40px) / ${grades < MAX_ITEMS ? grades : MAX_ITEMS})`,
    containerType: "inline-size",
    color: "#F6A313",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "clip",

    [`&:hover .${getStylesRef("character")}`]: {
      filter: "none",
      transform: "scale(1.1) translateX(45%)",
    },

    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      minWidth: 0,
      width: `calc(100vw / ${grades < MAX_ITEMS ? grades : MAX_ITEMS})`,

      [`&:hover .${getStylesRef("character")}`]: {
        transform: "scale(1.1)",
      },
    },

    p: {
      fontSize: "min( 10cqw, 40px )",
      fontWeight: "bold",
      maxWidth: "fit-content",
      margin: 0,
      lineHeight: 1,
      userSelect: "none",
      pointerEvents: "none",
      textAlign: "center",
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        fontSize: "min( 20cqw, 70px )",
      },
    },

    ".item_bg": {
      position: "absolute",
      objectFit: "cover",
      inset: 0,
      width: "100%",
      height: "100%",
      zIndex: -2,
      filter: "grayscale(1)",
      transition: "filter 150ms ease",

      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        height: "100vh",
      },

      "&:hover": {
        filter: "none",
      },
    },
  },

  character: {
    ref: getStylesRef("character"),
    userSelect: "none",
    pointerEvents: "none",
    position: "absolute",
    filter: "grayscale(1)",
    transition: "all 100ms ease-in-out",
    zIndex: -1,
    width: "auto",
    maxWidth: 200,
    margin: "auto",
    right: 0,
    marginRight: 0,
    marginBlock: "auto",
    insetBlock: 0,
    transform: "translateX(45%)",

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      width: "auto",
    },
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      height: "auto",
      right: "auto",
      left: "auto",
      bottom: "-8%",
      marginBottom: 0,
      transform: "none",
    },
  },
}));

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function GradeSelection({ onBack, onNext }: Props) {
  const [_, setQuery] = useSearchParams();
  const { data: schoolGrade } = useSchoolGradeCount({ enabled: false });

  function next(grade: SchoolGrade) {
    setQuery((prev) => {
      prev.set("schoolGrade", grade);
      return prev;
    });
    onNext();
  }

  const grades = schoolGrade!.filter((grade) => grade.count);
  const { classes } = useStyles(grades.length);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.button} onClick={onBack}>
          <IconX size={16} />
        </div>
        <h1>Qual o seu ano escolar?</h1>
      </div>

      <div className={classes.itemsContainer}>
        {grades.map(({ schoolGrade }, i) => (
          <div
            className={classes.item}
            key={i}
            onClick={() => next(schoolGrade)}
          >
            <p>{SCHOOL_GRADE[schoolGrade].split(" ")[0]}</p>

            <Character id={i + 1} className={classes.character} />
            <img src={bg} alt="" role="presentation" className="item_bg" />
          </div>
        ))}
      </div>
    </div>
  );
}
