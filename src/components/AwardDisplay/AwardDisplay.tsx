import { Tooltip, createStyles } from "@mantine/core";
import { type AwardImage } from "~/constants/awards";

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
  const { classes, cx } = useStyles(award.active);

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
      className={cx(classes.tooltip, tooltipClassName)}
    >
      <img
        alt={award.title}
        src={award.image}
        className={cx(classes.image, imgClassName)}
        onClick={award.active ? onClick : undefined}
        onKeyDown={award.active ? onClick : undefined}
      />
    </Tooltip>
  );
}

const useStyles = createStyles((_, active: boolean) => ({
  image: {
    filter: active ? "" : "grayScale(100%)",
    cursor: active ? "pointer" : "default",
    width: 150,
    height: 150,
  },
  tooltip: {
    whiteSpace: "pre-line",
    textAlign: "center",
  },
}));
