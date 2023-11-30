import { createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { lousaWidth } from "~/constants/dimensions";

const useStyles = createStyles({
  card: {
    width: (lousaWidth * 14) / 100,
    height: (lousaWidth * 16) / 100,
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
  showTargetLetters?: boolean | false;
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
  showTargetLetters,
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

  if (showTargetLetters)
    return (
      <div
        {...props}
        className={cx(classes.card, className)}
        style={{}}
        ref={drop}
      >
        {replaceWith}
      </div>
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
