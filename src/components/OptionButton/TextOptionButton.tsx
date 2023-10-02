import { createStyles } from "@mantine/core";
import { OptionButton } from ".";
import { OptionButtonProps } from "./OptionButton";
import { boardW } from "~/constants/dimensions";

const useStyles = createStyles({
  button: {
    width: "auto",
    height: "auto",
    paddingInline: boardW(24),
    paddingBlock: boardW(10),
    fontSize: boardW(40),
    borderRadius: 16,
    fontWeight: 700,
    color: "#228BE6",
  },
});

export function TextOptionButton(props: OptionButtonProps) {
  const { classes, cx } = useStyles();

  return (
    <OptionButton className={cx(props.className, classes.button)} {...props} />
  );
}
