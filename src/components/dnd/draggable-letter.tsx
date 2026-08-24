import { IconTrash } from "@tabler/icons-react";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";
import { useDraggable } from "@dnd-kit/core";

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
  optionItem: QuestionOption;
  onClear?: () => void;
  disabled?: boolean;
  id: number | string;
  dropped?: boolean;
  compact?: boolean;
  textClassName?: string;
};

export function DraggableLetter({
  optionItem,
  hidden,
  onClear,
  disabled,
  className,
  id,
  dropped,
  compact,
  textClassName,
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
        "rounded-[45px] shadow-[0px_8px_0px_0px_#4c494166] grid place-items-center",
        "w-full bg-surface relative select-none px-5 py-2",
        {
          ["opacity-40 cursor-grabbing"]: isDragging,
          ["pointer-events-none"]: disabled || hidden,
          ["opacity-10"]: hidden,
          ["aria-disabled:max-w-[70px] md:aria-disabled:max-w-[100px] aria-disabled:rounded-[25px]"]:
            dropped,
          ["aria-disabled:w-min aria-disabled:min-w-[40px] aria-disabled:rounded-[12px] p-2 md:p-5 md:aria-disabled:rounded-[25px]"]:
            compact,
        },
        className
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <p
        className={
          textClassName
            ? textClassName
            : "text-xl md:text-3xl text-text font-black"
        }
      >
        {optionItem.description}
      </p>

      {onClear && (
        <button
          className={cx(
            "bg-gray-500 opacity-55 text-white rounded-full grid place-items-center",
            "size-6 xl:size-7 absolute -top-1 inset-x-0 mx-auto pointer-events-auto",
            {
              ["-top-1 left-auto"]: compact,
            }
          )}
          onClick={onClear}
        >
          <IconTrash className="size-4 xl:size-7" />
        </button>
      )}
    </div>
  );
}
