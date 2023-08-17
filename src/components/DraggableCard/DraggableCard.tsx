import { Image, Text, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CSSProperties, useRef } from "react";
import { useDrag } from "react-dnd";
import { QuestionOption } from "~/api/exam";

const useStyles = createStyles((theme) => ({
  card: {
    width: 170,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#fff",
    boxShadow: "0 4px 0 0 #228BE6",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#228BE6",
    padding: 16,
    display: "grid",
    placeItems: "center",
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
  text: {
    fontSize: 30,
    fontWeight: 600,
    color: "#228BE6",
    userSelect: "none",
    pointerEvents: "none",
  },
  audio: {
    display: "none",
  },
}));

export type CardItem = QuestionOption & { type: "ANSWER_CARD" };

type Props = React.HTMLAttributes<HTMLDivElement> & {
  item: CardItem;
  onClear?: () => void;
};

export function DraggableCard({ item, hidden, onClear, ...props }: Props) {
  const { classes } = useStyles();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: item.type,
      item: () => item,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [item]
  );

  const styles: CSSProperties = {
    opacity: isDragging ? 0.4 : hidden ? 0.1 : 1,
    cursor: isDragging ? "move" : "grab",
    pointerEvents: hidden ? "none" : "all",
  };

  const soundRef = useRef<HTMLAudioElement>(null);

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (item.sound_url) {
      void soundRef.current?.play();
    }
    props?.onClick?.(e);
  }

  return (
    <div
      className={classes.card}
      style={styles}
      ref={drag}
      onDragStart={onClick}
      onClickCapture={onClick}
      {...props}
    >
      {item.image_url && (
        <Image
          src={item.image_url}
          w="100%"
          style={{ pointerEvents: "none", userSelect: "none" }}
        />
      )}
      {!item.image_url && item.description && (
        <Text className={classes.text}>{item.description}</Text>
      )}
      {onClear && (
        <button className={classes.close} onClick={onClear}>
          <IconTrash size={16} />
        </button>
      )}
      {item.sound_url && (
        <audio
          src={item.sound_url}
          ref={soundRef}
          className={classes.audio}
        ></audio>
      )}
    </div>
  );
}
