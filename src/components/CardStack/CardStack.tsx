import { createStyles } from "@mantine/core";
import { QuestionOption } from "~/api/exam";
import { Card, StackCardProps } from "./Card";

type StyleProps = {
  width?: number;
  height?: number;
};

const useStyles = createStyles((_, props: StyleProps) => ({
  wrapper: {
    position: "relative",
    height: props.height ? props.height : 153,
    width: props.width ? props.width : 170,
  },
}));

type Props = {
  options: QuestionOption[];
  cardProps?: Partial<StackCardProps>;
  className?: string;
};

export function CardStack({ options, className, cardProps }: Props) {
  const { classes, cx } = useStyles({
    width: cardProps?.variant === "square" ? 170 : 308,
    height: cardProps?.variant === "square" ? 153 : 210,
  });

  return (
    <div className={cx(classes.wrapper, className)}>
      {options.map((option, inx) => (
        <Card
          option={option}
          key={inx}
          order={inx + 1}
          stacked
          {...cardProps}
        />
      ))}
    </div>
  );
}
