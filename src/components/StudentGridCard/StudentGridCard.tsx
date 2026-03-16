import { Button } from "@mantine/core";
import { IconLockOpen } from "@tabler/icons-react";
import { Student } from "~/api/student";
import { cx } from "~/utils/cx";
import styles from "./StudentGridCard.module.css";

type Props = {
  student: Student;
  selected: boolean;
  onLogout: (studentId: string) => void;
  onSelected: (studentId: string) => void;
};

export function StudentGridCard({
  student,
  onLogout,
  onSelected,
  selected = false,
}: Props) {
  function handleClick() {
    if (student.reserved) {
      onLogout(student.id);
    } else {
      onSelected(student.id);
    }
  }

  return (
    <div className="relative w-full">
      {student.reserved && (
        <IconLockOpen color="#228BE6" height={20} className={styles.lock} />
      )}
      <Button
        id={student.id}
        onClick={handleClick}
        className={cx(styles.button, selected && styles.buttonSelected)}
        classNames={{
          root: cx(
            styles.buttonRoot,
            student.reserved && styles.buttonReserved,
            selected && styles.buttonRootSelected
          ),
        }}
        styles={{ inner: { maxWidth: "100%" } }}
      >
        <div className="flex flex-col w-full">
          <div
            className={`text-lg leading-none whitespace-pre-wrap ${
              student.reserved ? "text-gray-500" : "text-blue-600"
            }`}
          >
            {student.name}
          </div>
          <div
            className={`text-base ${
              student.reserved ? "text-gray-500" : "text-gray-700"
            }`}
          >
            {student.registry}
          </div>
        </div>
      </Button>
    </div>
  );
}
