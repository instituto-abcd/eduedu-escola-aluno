import { useDroppable } from "@dnd-kit/core";
import { cx } from "~/utils/cx";

type Props = {
  replaceWith?: React.ReactNode;
  id: number | string;
  size?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DroppableLetter({
  id,
  className,
  replaceWith,
  size,
  ...props
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  if (replaceWith) return replaceWith;

  return (
    <div
      {...props}
      className={cx(
        "rounded-[20px] transition-all bg-[#DADADA]",
        "w-full max-w-[70px] md:max-w-[200px] md:h-[50px] h-[48px]",
        {
          ["bg-green-300"]: isOver,
          ["rounded-xl"]: size && size < 3,
        },
        className
      )}
      ref={setNodeRef}
    />
  );
}
