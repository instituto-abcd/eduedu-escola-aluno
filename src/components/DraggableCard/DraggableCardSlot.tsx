import { useDroppable } from "@dnd-kit/core";
import { useEffect, useId } from "react";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";

type Props<T> = {
  onDrop: (item: T | null) => void;
  item: T | null;
  replaceWith?: React.ReactNode;
  size?: number;
  id: number | string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DraggableCardSlot<T = QuestionOption>({
  item,
  size,
  onDrop,
  id,
  className,
  replaceWith,
  ...props
}: Props<T>) {
  const { setNodeRef, isOver, over } = useDroppable({ id });
  console.log("over", over);

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
