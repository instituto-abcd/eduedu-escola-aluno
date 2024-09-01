import { createStyles, getStylesRef } from "@mantine/core";
import { MEDIA_QUERY } from "~/constants/dimensions";
import bg from "~/assets/bg-select-option.png";
import { Character } from "~/components/vector/Character";
import { SchoolGrade, useSchoolGradeCount } from "~/api/school-class";
import { SCHOOL_GRADE } from "~/constants";
import { useState } from "react";
import { Confirmation } from "./components/Confirmation";
import { useStudent } from "~/stores/student";
import { Header } from "./components/Header";

const MAX_ITEMS = 6;

const useStyles = createStyles((_, grades: number) => ({
  container: {
    height: "100vh",
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
  const { data: schoolGrade } = useSchoolGradeCount({ enabled: false });
  const updateStudentState = useStudent((s) => s.update);

  const grades = schoolGrade?.filter((grade) => grade.count) ?? [];
  const { classes } = useStyles(grades.length);

  // Handle selection of class item
  const [selected, setSelected] = useState<{
    text: string;
    image: JSX.Element;
  }>();

  function select({
    grade,
    spriteId,
  }: {
    grade: SchoolGrade;
    spriteId: number;
  }) {
    updateStudentState({ schoolGrade: grade });

    if (window.innerWidth >= 1024) {
      onNext();
      return;
    }

    setSelected({
      text: SCHOOL_GRADE[grade],
      image: <Character id={spriteId} />,
    });
  }

  return (
    <div className={classes.container}>
      <Header onClose={onBack} title="Qual o seu ano escolar?" />

      <div className={classes.itemsContainer}>
        {grades.map(({ schoolGrade }, i) => (
          <div
            className={classes.item}
            key={i}
            onClick={() => select({ grade: schoolGrade, spriteId: i + 1 })}
          >
            <p>{SCHOOL_GRADE[schoolGrade].split(" ")[0]}</p>

            <Character id={i + 1} className={classes.character} />
            <img src={bg} alt="" role="presentation" className="item_bg" />
          </div>
        ))}
      </div>

      <Confirmation
        metadata={selected}
        acceptCb={(accepted) => {
          setSelected(undefined);
          if (accepted) {
            onNext();
          }
        }}
      />
    </div>
  );
}
