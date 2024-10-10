import { Tooltip, createStyles, Text } from "@mantine/core";
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
        <>
          <Text size="sm" weight={700}>
            {award.title}
          </Text>
          <Text size="sm">{award.description}</Text>
        </>
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
        src={award.image}
        className={cx(classes.image, imgClassName)}
        onClick={award.active ? onClick : undefined}
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
