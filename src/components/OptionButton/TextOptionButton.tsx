import { createStyles } from "@mantine/core";
import { OptionButton } from ".";
import { OptionButtonProps } from "./OptionButton";

const useStyles = createStyles({
  button: {
    width: "auto",
    minWidth: "max-content",
    height: "max-content",
    paddingInline: 32,
    paddingBlock: 10,
    fontWeight: 400,
    fontSize: 20,
    color: "#228BE6",
  },
});

export function TextOptionButton(props: OptionButtonProps) {
  const { classes, cx } = useStyles();

  return (
    <OptionButton
      {...props}
      className={cx(classes.button, props.className)}
      style={{ ...props.style }}
    />
  );
}
