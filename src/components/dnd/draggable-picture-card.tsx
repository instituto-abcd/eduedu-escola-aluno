import { IconX } from "@tabler/icons-react";
import { QuestionOption } from "~/api/exam";
import { useCreateSound } from "~/hooks/useCreateSound";
import { cx } from "~/utils/cx";
import { useDraggable } from "@dnd-kit/core";

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
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "id">;

export function DraggablePictureCard({
  id,
  optionItem,
  sound: _sound,
  image,
  hidden,
  onClear,
  disabled,
  ...props
}: Props) {
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id,
    data: { option: optionItem },
    disabled,
  });

  const { sound, isPlaying } = useCreateSound({
    src: _sound ?? "",
    skipPlayStatus: true,
  });

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (sound) sound.play();
    props?.onClick?.(e);
  }

  return (
    <div
      {...props}
      className={cx(
        "relative aspect-video w-[30vw] md:w-[25vw] md:max-w-[200px] max-w-[140px]",
        "xl:max-w-none xl:w-full xl:h-auto aspect-[14/19]",
        {
          ["pointer-events-none"]: isPlaying,
          ["opacity-20 -scale-50"]: isDragging,
          ["bg-[#F8F6F2] rounded-[20px] h-[192px] w-[190px]"]: false, //withSurface,
        }
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <img
        src={image ?? ""}
        className={"object-cover select-none min-w-full"}
      />

      {onClear && (
        <button
          className="size-5 bg-red-500 text-white rounded-full grid place-items-center absolute top-0 inset-x-0 mx-auto"
          onClick={onClear}
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
