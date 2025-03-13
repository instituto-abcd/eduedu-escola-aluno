import { cx } from "~/utils/cx";

type Props = Omit<
  React.HTMLProps<HTMLParagraphElement>,
  "children" | "dangerouslySetInnerHTML"
> & {
  text: string;
};

export function TextTitle({ text, className, ...props }: Props) {
  return (
    <p
      dangerouslySetInnerHTML={{ __html: text }}
      className={cx(
        "text-text text-center text-xl md:text-2xl xl:text-4xl max-w-screen-md",
        className
      )}
      {...props}
    />
  );
}
