import { Text, createStyles } from "@mantine/core";
import { BREAKPOINT } from "~/constants/dimensions";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { text: string };

export function TextBubble({ text, className }: Props) {
  const { cx, classes } = useStyles();

  return (
    <div className={cx(classes.textBubble, className)}>
      <Text
        className={classes.text}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  textBubble: {
    backgroundColor: "white",
    borderRadius: 45,
    padding: 30,
    dislay: "flex",
    flexDirection: "column",
    gap: 30,
    maxHeight: 250,
    overflowY: "scroll",
  },
  text: {
    color: "#4D4941",
    textAlign: "center",
    fontSize: 20,
    lineHeight: "27px",
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      fontSize: 25,
      lineHeight: "34px",
    },
  },
}));
