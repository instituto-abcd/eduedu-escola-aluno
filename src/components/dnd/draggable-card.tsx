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

export function DraggableCard({
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
        "rounded-[20px] md:rounded-[45px] bg-[#F8F6F2] shadow-[0px_8px_0px_0px_#4c494166] grid place-items-center relative",
        "cursor-grab overflow-hidden p-1 md:p-4 h-[190px] sm:h-[192px]",
        "xl:max-w-none xl:w-full xl:h-auto aspect-square",
        "lg:max-h-[250px] lg:max-w-[250px]",
        {
          ["w-[105px] md:w-[190px]"]: !size,
          [`w-[calc(max-content/${size || 1})]`]: !!size,
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
      {image && (
        <img
          src={image}
          className={cx(
            "pointer-events-none select-none max-w-full object-cover absolute inset-0 my-auto",
            {
              ["max-h-[auto] mx-0 w-full overflow-hidden p-0 rounded-0"]:
                noPaddingRule,
              ["max-h-full mx-auto w-auto overflow-auto p-2 rounded-[20px] md:rounded-[45px]"]:
                !noPaddingRule,
            }
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
