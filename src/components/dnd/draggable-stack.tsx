import { useDraggable } from "@dnd-kit/core";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";
import { validString } from "~/utils/string";

/*
 * Usado no modelo 13
 */

type Props = {
  id: number | string;
  disabled?: boolean;
  optionItem: QuestionOption;
  imageOnly?: boolean;
  small?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DraggableStackItem({
  id,
  optionItem,
  className,
  disabled,
  imageOnly,
  small,
  ...props
}: Props) {
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id,
    data: { option: optionItem },
    disabled,
  });
  return (
    <div
      {...props}
      className={cx(
        "aspect-square w-full bg-surface shadow-card rounded-[45px] p-2",
        "flex flex-col items-center justify-center gap-1 select-none",
        {
          ["opacity-0 pointer-events-none"]: isDragging,
          ["w-[150px]"]: small,
        },
        className
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {validString(optionItem.image_url) && (
        <img
          src={optionItem.image_url!}
          alt={optionItem.description}
          className="h-2/3"
        />
      )}
      {!imageOnly && validString(optionItem.description) && (
        <div
          className={cx("font-bold text-text text-5xl text-center", {
            ["text-2xl"]: small,
          })}
          dangerouslySetInnerHTML={{ __html: optionItem.description }}
        />
      )}
    </div>
  );
}

export function DraggableStack({
  options,
  imageOnly,
}: {
  options: QuestionOption[];
  imageOnly?: boolean;
}) {
  return (
    <div className="relative max-w-[300px] md:max-w-[400px] size-full mx-auto">
      {options.map((op, index) => (
        <DraggableStackItem
          key={index}
          optionItem={op}
          id={index}
          className="absolute inset-0 my-auto"
          style={{ zIndex: index }}
          imageOnly={imageOnly}
        />
      ))}
    </div>
  );
}
