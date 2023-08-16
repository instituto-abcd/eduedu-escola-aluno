import { createStyles } from "@mantine/core";
import { OptionButton } from ".";

const useStyles = createStyles((theme) => ({
  button: {
    width: "auto",
    minWidth: "max-content",
    height: "max-content",
    paddingInline: 32,
    paddingBlock: 10,
    fontWeight: 400,
    fontSize: 20,
    color: "#228BE6",
    "&[data-selected=true]": {
      backgroundColor: theme.colors.gray[1],
    },
  },
}));

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function TextOptionButton(props: Props) {
  const { classes, cx } = useStyles();

  return (
    <OptionButton {...props} className={cx(classes.button, props.className)} />
  );
}
