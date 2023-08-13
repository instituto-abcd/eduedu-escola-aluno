import { Image, Text, createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { CardItem, DraggableGrayCard } from "./DraggableGrayCard";

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

export function DragSlotGrayCard({
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

  if (item !== null) return (
    <>
      <div {...props} className={classes.card} style={{}} ref={drop}>
        <Image my={10} src="https://place-hold.it/110" width={150} m="auto" />
        <Text my={10} align="center">Teste</Text>
        <DraggableGrayCard item={item} onClear={onClear} />
      </div>
    </>
  );
  return (
    <div {...props} className={classes.card} style={{}} ref={drop}>
      <Image my={10} src="https://place-hold.it/110" width={150} m="auto" />
      <Text my={10} align="center">Teste</Text>
    </div>
  )
}
