import { Group, createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { TextDropItem } from ".";

const useStyles = createStyles({
  area: {
    borderColor: "#868E96",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: "#F1F3F5",
    paddingInline: 32,
    paddingTop: 8,
    paddingBottom: 14,
    borderRadius: 16,
    minHeight: 70,
    width: "100%",
  },
});

export type TextAreaItem = {
  description: string;
};

type Props<T> = {
  items: Array<T | null>;
  onDrop: (item: T) => void;
  accept?: string | string[];
  onClear?: (index: number) => void;
};

export function DropArea<T extends TextAreaItem>({
  items,
  onDrop,
  onClear,
  accept = "ANSWER_CARD",
}: Props<T>) {
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

  return (
    <div className={classes.area} ref={drop}>
      <Group w="100%">
        {items.filter(Boolean).map((item, index) => (
          <TextDropItem
            item={item!}
            key={index}
            onClear={() => onClear?.(index)}
            disabled
          />
        ))}
      </Group>
    </div>
  );
}
