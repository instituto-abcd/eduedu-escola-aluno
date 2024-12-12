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

export function DroppablePictureCard({
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
        "border-dashed border-black/60 border-2 w-[30vw] md:w-[25vw] md:max-w-[200px] max-w-[140px] h-[190px]",
        "aspect-[14/19] md:h-full lg:max-h-[250px] lg:max-w-[250px]",
        {
          ["rounded-bl-[45px] rounded-tl-[45px]"]: index == 0,
          ["rounded-br-[45px] rounded-tr-[45px]"]: index == total - 1,
          ["border-green-300"]: isOver,
        }
      )}
    />
  );
}
