import { IconTrash } from "@tabler/icons-react";
import { useCreateSound } from "~/hooks/useCreateSound";
import { useDebugInfo } from "~/stores/debug-info";
import { DebugDiv } from "../Debug/DebugDiv";
import { QuestionOption } from "~/api/exam";
import { DebugProps } from "../Debug";
import { cx } from "~/utils/cx";
import { useId } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props<T> = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
  item: T;
  text?: string | null;
  textClasses?: string;
  sound?: string | null;
  image?: string | null;
  onClear?: () => void;
  debug?: DebugProps;
  noPaddingRule?: boolean | false;
  size?: number;
  id: string | number;
};

export function DraggableCard<T>({
  item,
  text,
  sound: _sound,
  debug,
  image,
  hidden,
  onClear,
  textClasses,
  noPaddingRule,
  size,
  ...props
}: Props<T>) {
  const id = useId();
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id,
    data: { option: item },
  });

  const { sound, isPlaying } = useCreateSound({
    src: _sound ?? "",
    skipPlayStatus: true,
  });

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (sound) sound.play();
    props?.onClick?.(e);
  }

  /* debug */
  const canDebug = useDebugInfo((s) => s.answer);

  return (
    <div
      {...props}
      // id={props.id.toString()}
      className={cx(
        "rounded-[20px] md:rounded-[45px] bg-[#F8F6F2] shadow-[0px_8px_0px_0px_#4c494166] grid place-items-center relative",
        "cursor-grab overflow-hidden p-4 h-[190px] sm:h-[192px]",
        "xl:max-w-none xl:w-full xl:h-auto aspect-square",
        {
          ["w-[105px] md:w-[190px]"]: !size,
          [`w-[calc(max-content/${size})]`]: !!size,
          ["opacity-40 cursor-grabbing"]: isDragging,
          ["pointer-events-none"]: isPlaying || hidden,
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
              ["max-h-full mx-auto w-auto overflow-auto p-6 rounded-[20px] md:rounded-[45px]"]:
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
            "bg-gray-500 opacity-55 text-white rounded-full grid place-items-center",
            "size-6 xl:size-12 absolute top-0 inset-x-0 mx-auto"
          )}
          onClick={onClear}
        >
          <IconTrash className="size-4 xl:size-9" />
        </button>
      )}
      {canDebug && !debug?.skipDebug && item && (
        <DebugDiv
          position={+(item as unknown as QuestionOption).position}
          debug={debug}
        >
          {(item as unknown as QuestionOption).isCorrect}
        </DebugDiv>
      )}
    </div>
  );
}
