import { IconTrash } from "@tabler/icons-react";
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

export function DraggableCardSquare({
  optionItem,
  text,
  debug,
  image,
  hidden,
  onClear,
  textClasses,
  noPaddingRule,
  size,
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
        "rounded-[20px] bg-[#F8F6F2] shadow-[0px_8px_0px_0px_#4c494166] grid place-items-center relative container-inline",
        "cursor-grab overflow-hidden p-1 md:p-4 aspect-square w-full max-w-[90px] min-w-[64px] md:min-w-[96px] md:max-w-[128px] lg:min-w-[160px] h-auto max-h-[90px] md:max-h-[128px] lg:max-h-[150px] lg:max-w-[150px]",
        {
          ["opacity-40 cursor-grabbing"]: isDragging,
          ["pointer-events-none"]: disabled || hidden,
          ["opacity-10"]: hidden,
          ["p-0"]: noPaddingRule,
        },
        props.className
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {text && (
        <p
          className={cx(
            "font-bold text-text select-none pointer-events-none",
            "text-3xl xl:text-[70px] xl:leading-[100%]",
            textClasses
          )}
        >
          {text}
        </p>
      )}
      {image && (
        <img
          src={image}
          className={cx(
            "pointer-events-none select-none max-w-full object-cover my-auto",
            {
              ["max-h-[auto] mx-0 w-full overflow-hidden p-0 rounded-0"]:
                noPaddingRule,
              ["max-h-full mx-auto w-auto overflow-auto p-2 rounded-[20px] md:rounded-[45px]"]:
                !noPaddingRule,
              "max-h-[12cqh]": text,
            }
          )}
        />
      )}
      {onClear && (
        <button
          className={cx(
            "bg-gray-500 opacity-55 text-white rounded-full grid place-items-center",
            "size-5 xl:size-12 absolute top-0 inset-x-0 mx-auto pointer-events-auto"
          )}
          onClick={onClear}
        >
          <IconTrash className="size-6 xl:size-9" />
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
