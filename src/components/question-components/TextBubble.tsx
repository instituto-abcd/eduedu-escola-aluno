import { cx } from "~/utils/cx";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { text: string; containerClasses?: string };

export function TextBubble({ text, className, containerClasses }: Props) {
  return (
    <div
      className={cx(
        "bg-white rounded-[45px] p-7 flex flex-col gap-7 max-h-[2550px] overflow-y-scroll ",
        containerClasses
      )}
    >
      <p
        dangerouslySetInnerHTML={{ __html: text }}
        className={cx(
          "text-text text-center text-xl md:text-2xl xl:text-4xl",
          className
        )}
      />
    </div>
  );
}
