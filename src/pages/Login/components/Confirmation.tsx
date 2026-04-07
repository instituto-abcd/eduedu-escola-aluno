import bg from "~/assets/bg-select-option.png";
import { AcceptRoundBtn } from "~/components/icons/AcceptRoundBtn";
import { RefuseRoundBtn } from "~/components/icons/RefuseRoundBtn";
import { cx } from "~/utils/cx";
import classes from "./Confirmation.module.css";

type Props = {
  acceptCb: (accepted: boolean) => void;
  metadata?: {
    text: string;
    image: JSX.Element;
  };
};

export function Confirmation({ acceptCb, metadata }: Props) {
  const visible = Boolean(metadata);

  return (
    <div className={cx(classes.container, visible && classes.visible)}>
      {metadata && (
        <>
          <div className={classes.sprite}>{metadata.image}</div>
          <h1 className={classes.text}>{metadata.text}</h1>
        </>
      )}

      <div className={classes.controls}>
        <div onClick={() => acceptCb(false)}>
          <RefuseRoundBtn />
        </div>
        <div onClick={() => acceptCb(true)}>
          <AcceptRoundBtn />
        </div>
      </div>
      <img
        src={bg}
        alt=""
        role="presentation"
        className={cx(classes.image, visible && classes.visible)}
      />
    </div>
  );
}
