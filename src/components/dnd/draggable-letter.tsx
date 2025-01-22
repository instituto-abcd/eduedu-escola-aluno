import { IconX } from "@tabler/icons-react";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";
import { useDraggable } from "@dnd-kit/core";

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
  optionItem: QuestionOption;
  onClear?: () => void;
  disabled?: boolean;
  id: number | string;
  dropped?: boolean;
};

export function DraggableLetter({
  optionItem,
  hidden,
  onClear,
  disabled,
  className,
  id,
  dropped,
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
        "rounded-[45px] shadow-[0px_8px_0px_0px_#4c494166] grid place-items-center p-5 w-full bg-surface relative select-none",
        {
          ["opacity-40 cursor-grabbing"]: isDragging,
          ["pointer-events-none"]: disabled || hidden,
          ["opacity-10"]: hidden,
          ["aria-disabled:max-w-[70px] aria-disabled:rounded-[25px]"]: dropped,
        },
        className
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <p className="text-2xl text-text font-black">{optionItem.description}</p>

      {onClear && (
        <button
          className={cx(
            "bg-red-500 text-white rounded-full grid place-items-center",
            "size-5 xl:size-9 absolute top-0 xl:-top-1/3 inset-x-0 mx-auto pointer-events-auto"
          )}
          onClick={onClear}
        >
          <IconX className="size-5 xl:size-9" />
        </button>
      )}
    </div>
  );
}
