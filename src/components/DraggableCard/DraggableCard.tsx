import { createStyles } from "@mantine/core";
import { useDrag } from "react-dnd";

const useStyles = createStyles({
  card: {
    width: 170,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#fff",
    boxShadow: "0 4px 0 0 #228BE6",
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
> & {
  id: string;
};

export function DraggableCard(props: Props) {
  const { classes } = useStyles();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ANSWER_CARD",
      item: () => ({ id: props.id }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [props.id]
  );
  return (
    <div
      className={classes.card}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      {...props}
      ref={drag}
    />
  );
}
