import { createStyles } from "@mantine/core";
import { TextBubble } from "./TextBubble";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { text: string };

export function TitleBubble({ text, className }: Props) {
  const { cx, classes } = useStyles();

  return (
    <TextBubble
      text={text}
      className={cx(classes.bubble, className)}
    />
  );
}

const useStyles = createStyles(() => ({
  bubble: {
    paddingBlock: 10,
    paddingInline: 20,
  },
}));
