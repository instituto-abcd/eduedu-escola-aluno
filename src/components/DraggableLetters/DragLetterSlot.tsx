import { createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { DraggableLetters } from ".";
import { QuestionOption } from "~/api/exam";

const useStyles = createStyles({
  card: {
    width: 87,
    height: 78,
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

  if (option !== null)
    return <DraggableLetters onClear={onClear} option={option} disabled />;
  return <div {...props} className={classes.card} style={{}} ref={drop} />;
}
