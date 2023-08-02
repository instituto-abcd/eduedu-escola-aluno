import { createStyles } from "@mantine/core";

const useStyles = createStyles({
  card: {
    width: 170,
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#868E96",
    backgroundColor: "#F1F3F5",
  },
});

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function DragSlotCard(props: Props) {
  const { classes } = useStyles();

  return <div {...props} className={classes.card} />;
}
