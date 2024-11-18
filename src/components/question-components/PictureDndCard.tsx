import { useDrag } from "react-dnd";
import { DebugProps } from "../Debug";
import { useCreateSound } from "~/hooks/useCreateSound";
import { cx } from "~/utils/cx";
import { IconX } from "@tabler/icons-react";

type Props<T> = React.HTMLAttributes<HTMLDivElement> & {
  item: T;
  itemType?: string;
  sound?: string | null;
  image: string | null;
  disabled?: boolean;
  onClear?: () => void;
  debug?: DebugProps;
  withSurface?: boolean;
  aspectRatio?: string;
};

export function PictureDndCard<T>({
  item,
  sound: _sound,
  debug,
  image,
  hidden,
  onClear,
  disabled,
  itemType = "ANSWER_CARD",
  withSurface = false,
  ...props
}: Props<T>) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: itemType,
      item: () => item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item]
  );

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
          ["bg-[#F8F6F2] rounded-[20px] h-[192px] w-[190px]"]: withSurface,
        }
      )}
      ref={disabled ? null : drag}
      onDragStart={onClick}
      onClickCapture={onClick}
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
