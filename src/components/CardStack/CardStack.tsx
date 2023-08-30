import { createStyles } from "@mantine/core";
import { QuestionOption } from "~/api/exam";
import { Card, StackCardProps } from "./Card";
import { useEffect, useState } from "react";

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
};

export function CardStack({ options, cardProps }: Props) {
  const { classes } = useStyles({
    width: cardProps?.variant === "square" ? 170 : 308,
    height: cardProps?.variant === "square" ? 153 : 210,
  });

  // Slice nas options de 1 a 3.
  // Quando o card estiver dragging, remover do array <--- IN PROGRESS
  // Quando for solto fora de um slot, devolver ao array
  // Quando ouver onClear, devolver ao array

  const [workingOptions, setWorkingOptions] = useState<QuestionOption[]>(
    options.slice(0, 3)
  );

  useEffect(() => {
    setWorkingOptions(options.slice(0, 3));
  }, [options]);

  return (
    <div className={classes.wrapper}>
      {workingOptions.map((option, inx) => (
        <Card
          option={option}
          key={JSON.stringify(option)}
          order={inx + 1}
          stacked
          {...cardProps}
        />
      ))}
    </div>
  );
}
