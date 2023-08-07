import { createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";

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

  const [{ canDrop, didDrop }, drop] = useDrop(
    () => ({
      accept: "ANSWER_CARD",

      hover: (item, monitor) => {
        // console.log("HOVER ITEM", item, monitor.getItemType());
      },

      drop: (item, monitor) => {
        console.log("DROP ITEM", item, monitor.getDropResult());
        return { id: "asd123" };
      },

      collect: (monitor) => ({
        didDrop: !!monitor.didDrop(),
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );

  return (
    <>
      <div
        {...props}
        className={classes.card}
        style={{ backgroundColor: canDrop ? "red" : undefined }}
        ref={drop}
      />
      <p>{didDrop ? "DROPPED" : "NOT DROPPED"}</p>
    </>
  );
}
