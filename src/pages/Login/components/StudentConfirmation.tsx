import { Student } from "~/api/student";
import { AcceptRoundBtn } from "~/components/icons/AcceptRoundBtn";
import { RefuseRoundBtn } from "~/components/icons/RefuseRoundBtn";
import titoTita from "~/assets/tito-e-tita.png";
import { cx } from "~/utils/cx";
import classes from "./StudentConfirmation.module.css";

type Props = {
  acceptCb: (accepted: boolean) => void;
  student?: Student;
};

export function StudentConfirmation({ acceptCb, student }: Props) {
  const visible = Boolean(student);

  return (
    <div className={cx(classes.container, visible && classes.visible)}>
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
