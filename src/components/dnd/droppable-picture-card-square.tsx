import { useDroppable } from "@dnd-kit/core";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";

type Props = {
  optionItem: QuestionOption | null;
  replaceWith?: React.ReactNode;
  index: number;
  total: number;
  id: number | string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DroppablePictureCardSquare({
  optionItem,
  index,
  total,
  className,
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
        "relative -top-5 border-dashed border-black/60 border-2 w-1/3 aspect-square min-w-[50px]",
        {
          ["border-green-300"]: isOver,
        }
      )}
    />
  );
}
