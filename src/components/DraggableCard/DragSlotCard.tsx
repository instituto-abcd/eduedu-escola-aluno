import { createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { CardItem, DraggableCard } from "./DraggableCard";

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

type Props = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "onDrop"
> & {
  onDrop: (item: CardItem) => void;
  accept: string | string[];
  item: CardItem | null;
  onClear?: () => void;
};

export function DragSlotCard({
  onDrop,
  accept,
  item,
  onClear,
  ...props
}: Props) {
  const { classes } = useStyles();

  const [, drop] = useDrop(
    () => ({
      accept,
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  if (item !== null) return <DraggableCard item={item} onClear={onClear} />;
  return <div {...props} className={classes.card} style={{}} ref={drop} />;
}
