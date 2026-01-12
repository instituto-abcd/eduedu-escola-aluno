import bg from "~/assets/bg-select-option.png";
import { Character } from "~/components/vector/Character";
import { SchoolGrade, useSchoolGradeCount } from "~/api/school-class";
import { SCHOOL_GRADE } from "~/constants";
import { useState } from "react";
import { Confirmation } from "./components/Confirmation";
import { useStudent } from "~/stores/student";
import { Header } from "./components/Header";
import { LoginLoader } from "./LoginLoader";
import styles from "./GradeSelection.module.css";

const MAX_ITEMS = 6;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function GradeSelection({ onBack, onNext }: Props) {
  const { data: schoolGrade, isLoading } = useSchoolGradeCount({
    enabled: false,
  });
  const updateStudentState = useStudent((s) => s.update);

  const grades = schoolGrade?.filter((grade) => grade.count) ?? [];
  const gradesCount = grades.length;

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

  if (isLoading) return <LoginLoader />;
  return (
    <div className={styles.container}>
      <Header onClose={onBack} title="Qual o seu ano escolar?" />

      <div className={styles.itemsContainer}>
        {grades.map(({ schoolGrade }, i) => (
          <div
            className={styles.item}
            key={i}
            onClick={() => select({ grade: schoolGrade, spriteId: i + 1 })}
            style={
              {
                "--item-min-height": `calc((100vh - 40px) / ${gradesCount < MAX_ITEMS ? gradesCount : MAX_ITEMS})`,
                "--item-width": `calc(100vw / ${gradesCount < MAX_ITEMS ? gradesCount : MAX_ITEMS})`,
              } as React.CSSProperties
            }
          >
            <p>{SCHOOL_GRADE[schoolGrade].split(" ")[0]}</p>

            <Character id={i + 1} className={styles.character} />
            <img
              src={bg}
              alt=""
              role="presentation"
              className={styles.itemBg}
            />
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
