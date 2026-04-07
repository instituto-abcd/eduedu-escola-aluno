import bg from "~/assets/bg-select-option.png";
import { Sprite } from "~/components/vector/Sprite";
import { AccessCodes, useGetAccessCodes } from "~/api/user";
import { useStudent } from "~/stores/student";
import { Header } from "./components/Header";
import { LockIcon } from "~/components/icons/LockIcon";
import { LoginLoader } from "./LoginLoader";
import styles from "./PasswordSelection.module.css";

const MAX_ITEMS = 4;

type Props = { onNext: () => void; onBack: () => void };

export function PasswordSelection({ onBack, onNext }: Props) {
  const studentState = useStudent();
  const { data: accessCodes, isLoading } = useGetAccessCodes(
    studentState.schoolClassId,
    {
      enabled: false,
    }
  );

  function handleNext(code: AccessCodes) {
    if (code.correctAnswer) {
      onNext();
    }
  }

  if (isLoading) return <LoginLoader />;
  return (
    <div className={styles.container}>
      <Header title="Qual sua senha?" onClose={onBack} />

      <div className={styles.itemsContainer}>
        {accessCodes?.map((code, i) => (
          <div className={styles.item} key={i} onClick={() => handleNext(code)}>
            <p>{code.accessKey}</p>

            <Sprite
              set="planets"
              id={i * MAX_ITEMS + i}
              className={styles.sprite}
            />
            <img src={bg} alt="" role="presentation" className={styles.itemBg} />
            <LockIcon className={styles.lock} />
          </div>
        ))}
      </div>
    </div>
  );
}
