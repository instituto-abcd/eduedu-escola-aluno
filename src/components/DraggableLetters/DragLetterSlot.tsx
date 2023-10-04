import { createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { DraggableLetters } from ".";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";

const useStyles = createStyles({
  card: {
    paddingInline: boardW(24),
    paddingBlock: boardW(10),
    fontSize: boardW(20),
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
  onDrop: (item: QuestionOption) => void;
  accept?: string | string[];
  option: QuestionOption | null;
  onClear?: () => void;
};

export function DragLetterSlot({
  onDrop,
  accept = "ANSWER_LETTERS",
  option,
  onClear,
  className,
  ...props
}: Props) {
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

  if (option !== null)
    return (
      <DraggableLetters
        onClear={onClear}
        option={option}
        disabled
        style={{ ...props.style }}
      />
    );

  return (
    <div className={cx(classes.card, className)} ref={drop} {...props}>
      <p style={{ opacity: 0 }}>GG</p>
    </div>
  );
}
