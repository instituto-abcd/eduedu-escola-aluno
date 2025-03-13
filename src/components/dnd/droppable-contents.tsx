import { useDroppable } from "@dnd-kit/core";
import { cx } from "~/utils/cx";
import { validString } from "~/utils/string";

/*
 * Usado no modelo 13
 */

type Props = {
  id: number | string;
  image?: string;
  text?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DroppableContents({
  id,
  image,
  text,
  className,
  ...props
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      {...props}
      className={cx(
        "aspect-square w-[150px] bg-surface shadow-card rounded-[45px] p-2",
        "flex flex-col items-center justify-center gap-1 select-none",
        {
          ["bg-green-300/30"]: isOver,
        },
        className
      )}
      ref={setNodeRef}
    >
      {validString(image) && (
        <img
          src={image}
          alt={text ?? ""}
          className="h-2/3 max-h-[90px] w-full"
        />
      )}
      {validString(text) && (
        <p className="font-bold text-text text-2xl">{text}</p>
      )}
    </div>
  );
}
