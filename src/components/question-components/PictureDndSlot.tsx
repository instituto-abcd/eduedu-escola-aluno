import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { cx } from "~/utils/cx";

type Props<T> = {
  onDrop: (item: T | null) => void;
  accept?: string | string[];
  item: T | null;
  replaceWith?: React.ReactNode;
  index: number;
  total: number;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "onDrop"
>;

export function PictureDndSlot<T = QuestionOption>({
  item,
  index,
  total,
  onDrop,
  className,
  replaceWith,
  accept = "ANSWER_CARD",
  ...props
}: Props<T>) {
  const [, drop] = useDrop(
    () => ({
      accept,
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  if (item !== null && replaceWith) return replaceWith;
  return (
    <div
      {...props}
      ref={drop}
      className={cx(
        "border-dashed border-black/60 border-2 w-[30vw] md:w-[25vw] md:max-w-[200px] max-w-[140px] h-[190px]",
        "xl:max-w-none xl:w-auto xl:h-full aspect-[14/19]",
        {
          ["rounded-bl-[45px] rounded-tl-[45px]"]: index == 0,
          ["rounded-br-[45px] rounded-tr-[45px]"]: index == total - 1,
        }
      )}
    />
  );
}
