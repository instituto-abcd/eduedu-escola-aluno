import { TextBubble } from "./TextBubble";
import { cx } from "~/utils/cx";
import classes from "./TitleBubble.module.css";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { text: string };

export function TitleBubble({ text, className }: Props) {
  return (
    <TextBubble
      text={text}
      className={cx(classes.bubble, className)}
    />
  );
}
