import { IconX } from "@tabler/icons-react";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";
import { useDraggable } from "@dnd-kit/core";
import { useEffect } from "react";
import { useCreateSound } from "~/hooks/useCreateSound";

type Props = {
  optionItem: QuestionOption;
  replaceWith?: React.ReactNode;
  index: number;
  total: number;
  id: number;
  disabled?: boolean;
  sound?: string | null;
  image: string | null;
  onClear?: () => void;
  aspectRatio?: string;
  playSound?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DraggablePictureCardSquare({
  id,
  optionItem,
  sound: _sound,
  image,
  hidden,
  onClear,
  disabled,
  playSound = false,
  ...props
}: Props) {
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id,
    data: { option: optionItem },
    disabled,
  });

  const { isPlaying, sound } = useCreateSound({ src: _sound ?? "" });
  function play() {
    if (_sound && !isPlaying) {
      sound.play();
    }
  }

  return (
    <div
      {...props}
      className={cx(
        " relative -top-5 w-1/3 aspect-square rounded-[10px] md:rounded-[22px] bg-[#F8F6F2] shadow-[0px_8px_0px_0px_#4c494166] grid place-items-center min-w-[50px]",
        {
          ["pointer-events-none"]: disabled,
          ["opacity-20 -scale-50"]: isDragging,
        },
        props.className
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onFocus={play}
    >
      <img
        src={image ?? ""}
        className={"object-fill select-none min-w-full max-h-[80px]"}
      />
      {onClear && (
        <button
          className="size-5 bg-red-500 text-white rounded-full grid place-items-center absolute top-0 inset-x-0 mx-auto pointer-events-auto"
          onClick={onClear}
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
