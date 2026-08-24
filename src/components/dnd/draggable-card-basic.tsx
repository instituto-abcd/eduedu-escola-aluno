import { IconTrash } from "@tabler/icons-react";
import { useDebugInfo } from "~/stores/debug-info";
import { QuestionOption } from "~/api/exam";
import { debug_getNumberIcon, DebugProps } from "../Debug";
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

export function DraggableCardBasic({
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
        "rounded-[45px] bg-[#F8F6F2] shadow-[0px_8px_0px_0px_#4c494166] flex items-center justify-center relative",
        "cursor-grab overflow-hidden p-1",
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
            textClasses
          )}
        >
          {text}
        </span>
      )}
      {onClear && (
        <button
          className={cx(
            "bg-gray-500 opacity-55 text-white rounded-full grid place-items-center",
            "size-5 xl:size-12 absolute right-0 mx-auto pointer-events-auto"
          )}
          onClick={onClear}
        >
          <IconTrash className="size-6 xl:size-9" />
        </button>
      )}
      {canDebug && !debug?.skipDebug && optionItem && (
        <div>
          <DebugDiv
            position={+(optionItem as unknown as QuestionOption).position}
            debug={debug}
          >
            {(optionItem as unknown as QuestionOption).isCorrect}
          </DebugDiv>
        </div>
      )}
    </div>
  );
}

export const DebugDiv: React.FC<{
  children?: React.ReactNode;
  position?: unknown;
  debug?: DebugProps;
}> = ({ children, position, debug }) => {
  if (position !== undefined && debug?.debugProperty === "position")
    return (
      <div className="z-1 text-[#25abe6]">{debug_getNumberIcon(position)}</div>
    );

  return (
    <div className="z-1 pr-4">
      {typeof children === "boolean" ? (children ? "✅" : "❌") : children}
    </div>
  );
};
