import { useDroppable } from "@dnd-kit/core";
import { cx } from "~/utils/cx";

type Props = {
  replaceWith?: React.ReactNode;
  id: number | string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DroppableLetter({
  id,
  className,
  replaceWith,
  ...props
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  if (replaceWith) return replaceWith;

  return (
    <div
      {...props}
      className={cx(
        "rounded-[20px] transition-all bg-[#DADADA]",
        "w-full max-w-[70px] aspect-square",
        {
          ["bg-green-300"]: isOver,
        },
        className
      )}
      ref={setNodeRef}
    />
  );
}
