import { Image, Text, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import { QuestionOption } from "~/api/exam";

const useStyles = createStyles((theme) => ({
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.blue[6],
    borderStyle: "solid",
    borderRadius: 16,
    boxShadow: `0px 8px 0px 0px ${theme.colors.blue[6]}`,
    backgroundColor: "#fff",
    color: theme.colors.blue[6],
    cursor: "grab",
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1,
    userSelect: "none",
    position: "relative",
  },
  close: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
    backgroundColor: theme.colors.red[6],
    color: "#fff",
    borderRadius: "50%",
    border: 0,
    display: "grid",
    placeItems: "center",
    transform: "translate(50%, -50%)",
    cursor: "pointer",
  },
}));

type DraggableLettersProps = React.HTMLAttributes<HTMLDivElement> & {
  onClear?: () => void;
  option: QuestionOption;
  type?: string;
};

export function DraggableLetters({
  onClear,
  option,
  type = "ANSWER_LETTERS",
  hidden,
  ...props
}: DraggableLettersProps) {
  const { classes, cx } = useStyles();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: () => option,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [option]
  );

  const styles: CSSProperties = {
    opacity: isDragging ? 0.4 : hidden ? 0.1 : 1,
    cursor: isDragging ? "move" : "grab",
    pointerEvents: hidden ? "none" : "all",
  };

  return (
    <div
      {...props}
      style={{ ...props.style, ...styles }}
      className={cx(classes.option, props.className)}
      ref={drag}
    >
      {option.image_url && (
        <Image src={option.image_url} width={40} alt={option.image_name} />
      )}
      {!option.image_url && option.description && (
        <Text>{option.description}</Text>
      )}
      {onClear && (
        <button className={classes.close} onClick={onClear}>
          <IconTrash size={16} />
        </button>
      )}
    </div>
  );
}
