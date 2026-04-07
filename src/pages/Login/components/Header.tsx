import { IconX } from "@tabler/icons-react";
import { cx } from "~/utils/cx";
import classes from "./Header.module.css";

type Props = {
  onClose: () => void;
  title: string;
  transparent?: boolean;
};

export function Header({ title, onClose, transparent }: Props) {
  return (
    <div className={cx(classes.header, transparent && classes.transparent)}>
      <div className={classes.button} onClick={onClose}>
        <IconX size={16} />
      </div>
      <h1>{title}</h1>
    </div>
  );
}
