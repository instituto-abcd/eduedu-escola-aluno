import { useDroppable } from "@dnd-kit/core";
import { useId } from "react";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";

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
  const id = useId();
  const { setNodeRef, isOver } = useDroppable({ id });

  if (item !== null && replaceWith) return replaceWith;

  return (
    <div
      {...props}
      className={cx(
        "rounded-[20px] md:rounded-[45px] shadow-0px_8px_0px_#4C494166 transition-all bg-[#DADADA]",
        "w-[30vw] md:w-[25vw] md:max-w-[200px] max-w-[140px] h-[190px] aspect-square",
        {
          ["w-[105px] md:w-[190px] xl:max-w-none xl:w-auto xl:h-full"]: !size,
          [`w-[calc(max-content/${size} xl:w-auto)]`]: !!size,
          ["bg-green-300"]: isOver,
        },
        className
      )}
      ref={setNodeRef}
    />
  );
}
