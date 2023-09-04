import { createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";

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

type Props<T> = {
  onDrop: (item: T | null) => void;
  accept?: string | string[];
  item: T | null;
  replaceWith?: React.ReactNode;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "onDrop"
>;

export function DraggableCardSlot<T = QuestionOption>({
  item,
  onDrop,
  className,
  replaceWith,
  accept = "ANSWER_CARD",
  ...props
}: Props<T>) {
  const { classes, cx } = useStyles();

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

  if (item !== null && replaceWith) return replaceWith;
  return (
    <div
      {...props}
      className={cx(classes.card, className)}
      style={{}}
      ref={drop}
    />
  );
}
