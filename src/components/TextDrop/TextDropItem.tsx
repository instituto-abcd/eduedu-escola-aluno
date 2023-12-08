import { createStyles } from "@mantine/core";
import { TextAreaItem } from ".";
import { useDrag } from "react-dnd";
import { CSSProperties } from "react";
import { IconTrash } from "@tabler/icons-react";
import { boardW } from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  option: {
    paddingBlock: 5,
    paddingInline: 10,
    borderWidth: 1,
    borderColor: theme.colors.blue[6],
    borderStyle: "solid",
    borderRadius: 16,
    boxShadow: `0px 8px 0px 0px ${theme.colors.blue[6]}`,
    backgroundColor: "#fff",
    color: theme.colors.blue[6],
    cursor: "grab",
    fontWeight: 600,
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

type Props = {
  type?: string;
  disabled?: boolean;
  hidden?: boolean;
  onClear?: () => void;
  item: TextAreaItem;
};

export function TextDropItem({
  item,
  hidden,
  disabled,
  onClear,
  type = "ANSWER_CARD",
}: Props) {
  const { classes } = useStyles();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: () => item,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: !hidden && !disabled,
    }),
    [item, hidden, disabled]
  );

  const styles: CSSProperties = {
    fontSize: boardW(28),
    opacity: isDragging ? 0.4 : hidden ? 0.1 : 1,
    cursor: isDragging ? "move" : "grab",
    pointerEvents: hidden ? "none" : "all",
  };

  return (
    <div style={styles} ref={drag} className={classes.option}>
      {item.description}
      {onClear && (
        <button className={classes.close} onClick={onClear}>
          <IconTrash size={16} />
        </button>
      )}
    </div>
  );
}
