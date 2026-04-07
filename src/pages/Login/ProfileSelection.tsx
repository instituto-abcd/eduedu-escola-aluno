import { EduEduLogo } from "~/components/icons/EduEduLogo";
import {
  CharacterStudent,
  CharacterProfessor,
} from "~/components/vector/Character";
import { cx } from "~/utils/cx";
import classes from "./ProfileSelection.module.css";

type Profile = "STUDENT" | "TEACHER";

export function ProfileSelection({ onNext }: { onNext: () => void }) {
  function handleSelection(value: Profile) {
    if (value === "STUDENT") return onNext();
    if (value === "TEACHER") return window.open(import.meta.env.VITE_ADMIN_URL);
  }

  return (
    <div className={classes.container}>
      <div
        className={cx(classes.selectionBox, classes.bgStudent)}
        onClick={() => handleSelection("STUDENT")}
      >
        <CharacterStudent className={classes.character} />
        <h2>Aluno</h2>
      </div>
      <div
        className={cx(classes.selectionBox, classes.bgProfessor)}
        onClick={() => handleSelection("TEACHER")}
      >
        <CharacterProfessor className={classes.character} />
        <h2>Professor</h2>
      </div>

      <EduEduLogo className={classes.floatingLogo} />
    </div>
  );
}
