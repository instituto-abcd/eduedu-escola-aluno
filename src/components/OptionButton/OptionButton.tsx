import { createStyles } from "@mantine/core";

const useStyles = createStyles({
  button: {
    width: 170,
    height: 148,
    borderRadius: 8,
    border: "1px solid #228BE6",
    backgroundColor: "#fff",
    cursor: "pointer",
    boxShadow: "0px 5px 0px 0px #228BE6",
    display: "grid",
    placeItems: "center",
    fontSize: 30,
    fontWeight: 600,
    color: "#228BE6",
    userSelect: "none",
    wordBreak: "break-all",
    ":active": {
      boxShadow: "0px 2px 0px 0px #228BE6",
      transform: "translateY(3px)",
    },
  },
});

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function OptionButton(props: Props) {
  const { classes, cx } = useStyles();

  return <button {...props} className={cx(classes.button, props.className)} />;
}
