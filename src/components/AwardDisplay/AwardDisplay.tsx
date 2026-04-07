import { Tooltip } from "@mantine/core";
import { type AwardImage } from "~/constants/awards";
import styles from "./AwardDisplayStyle.module.css";

type Props = {
  award: AwardImage;
  imgClassName?: string;
  tooltipClassName?: string;
  onClick?: () => void;
};


export function AwardDisplay({
  onClick,
  award,
  imgClassName,
  tooltipClassName,
}: Props) {
  return (
    <Tooltip
      disabled={!award.active}
      label={
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold">{award.title}</span>
          <span className="text-sm">{award.description}</span>
        </div>
      }
      transitionProps={{ transition: "scale", duration: 300 }}
      color="dark.3"
      position="bottom"
      withArrow
      multiline
      width={200}
      className={[styles.tooltip, tooltipClassName].filter(Boolean).join(' ')}
    >
      <img
        alt={award.title}
        src={award.image}
        className={[
          award.active ? styles.imageActive : styles.image,
          imgClassName
        ].filter(Boolean).join(' ')}
        onClick={award.active ? onClick : undefined}
        onKeyDown={award.active ? onClick : undefined}
      />
    </Tooltip>
  );
}

