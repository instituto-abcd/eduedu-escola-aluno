import { useDroppable } from "@dnd-kit/core";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";

type Props = {
  optionItem: QuestionOption | null;
  replaceWith?: React.ReactNode;
  id: number | string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DroppablePictureCardBasic({
  optionItem,
  className,
  children,
  replaceWith,
  id,
  ...props
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  if (optionItem !== null && replaceWith) return replaceWith;

  return (
    <div
      {...props}
      ref={setNodeRef}
      className={cx(
        {
          ["opacity-60"]: isOver,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
