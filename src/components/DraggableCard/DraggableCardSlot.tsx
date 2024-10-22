import { createStyles } from "@mantine/core";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { BREAKPOINT } from "~/constants/dimensions";

type Props<T> = {
  onDrop: (item: T | null) => void;
  accept?: string | string[];
  item: T | null;
  replaceWith?: React.ReactNode;
  size?: number;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "onDrop"
>;

export function DraggableCardSlot<T = QuestionOption>({
  item,
  size,
  onDrop,
  className,
  replaceWith,
  accept = "ANSWER_CARD",
  ...props
}: Props<T>) {
  const { classes, cx } = useStyles({ size });

  const [, drop] = useDrop(
    () => ({
      accept,
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [],
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

const useStyles = createStyles((theme, props: { size?: number }) => ({
  card: {
    borderRadius: 20,
    backgroundColor: "#DADADA",
    boxShadow: "0px 8px 0px 0px #4C494166",
    width: props.size ? `calc(max-content / ${props.size})` : 105,
    height: 192,
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      borderRadius: 45,
      width: props.size ? `calc(max-content / ${props.size})` : 190,
      height: 192,
    },
    [theme.fn.largerThan(BREAKPOINT.TABLET_HORZ)]: {
      width: 190,
    },
  },
}));
