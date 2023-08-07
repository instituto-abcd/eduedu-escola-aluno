import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.blue[6],
    borderStyle: "solid",
    borderRadius: 16,
    boxShadow: `0px 8px 0px 0px ${theme.colors.blue[6]}`,
    backgroundColor: "#fff",
    color: theme.colors.blue[6],
    cursor: "grab",
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1,
    userSelect: "none",
  },
}));

type DraggableLettersProps = React.HTMLAttributes<HTMLDivElement>;

export function DraggableLetters(props: DraggableLettersProps) {
  const { classes, cx } = useStyles();

  return <div {...props} className={cx(classes.option, props.className)} />;
}
