import { createStyles } from "@mantine/core";

const useStyles = createStyles({
  card: {
    width: 170,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#fff",
    boxShadow: "0 1px 0 0 #006AC6",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#228BE6",
    padding: 16,
    display: "grid",
    placeItems: "center",
  },
});

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function DraggableCard(props: Props) {
  const { classes } = useStyles();

  return <div className={classes.card} {...props} draggable />;
}
