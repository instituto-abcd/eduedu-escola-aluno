import { IconX } from "@tabler/icons-react";
import { useDebugInfo } from "~/stores/debug-info";
import { DebugDiv } from "../Debug/DebugDiv";
import { QuestionOption } from "~/api/exam";
import { DebugProps } from "../Debug";
import { cx } from "~/utils/cx";
import { useDraggable } from "@dnd-kit/core";

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
  optionItem: QuestionOption;
  text?: string | null;
  textClasses?: string;
  sound?: string | null;
  image?: string | null;
  onClear?: () => void;
  debug?: DebugProps;
  noPaddingRule?: boolean | false;
  size?: number;
  id: string | number;
  disabled?: boolean;
};

export function DraggablePictureCardBasic({
  optionItem,
  text,
  debug,
  image,
  hidden,
  onClear,
  textClasses,
  id,
  disabled,
  ...props
}: Props) {
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id,
    data: { option: optionItem },
    disabled,
  });

  /* debug */
  const canDebug = useDebugInfo((s) => s.answer);

  return (
    <div
      {...props}
      className={cx(
        "rounded-[45px] bg-[#F8F6F2] shadow-[0px_8px_0px_0px_#4c494166] grid place-items-center relative",
        "cursor-grab overflow-hidden p-1 aspect-square md:aspect-[3/2] w-full md:w-3/4",
        {
          ["opacity-40 cursor-grabbing"]: isDragging,
          ["pointer-events-none"]: disabled || hidden,
          ["opacity-10"]: hidden,
        },
        props.className
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {image && (
        <img
          src={image}
          className={cx(
            "pointer-events-none select-none max-h-full max-w-full object-cover absolute"
          )}
        />
      )}
      {text && !image && (
        <span
          className={cx(
            "font-bold text-[#228BE6] select-none pointer-events-none",
            "text-4xl xl:text-[70px] xl:leading-[100%]",
            textClasses
          )}
        >
          {text}
        </span>
      )}
      {onClear && (
        <button
          className={cx(
            "bg-red-500 text-white rounded-full grid place-items-center",
            "size-5 xl:size-12 absolute top-0 inset-x-0 mx-auto pointer-events-auto"
          )}
          onClick={onClear}
        >
          <IconX className="size-5 xl:size-9" />
        </button>
      )}
      {canDebug && !debug?.skipDebug && optionItem && (
        <DebugDiv
          position={+(optionItem as unknown as QuestionOption).position}
          debug={debug}
        >
          {(optionItem as unknown as QuestionOption).isCorrect}
        </DebugDiv>
      )}
    </div>
  );
}
