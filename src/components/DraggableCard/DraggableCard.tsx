import { Text, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CSSProperties, useCallback, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { boardW, lousaWidth } from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  card: {
    width: (lousaWidth * 14) / 100,
    height: (lousaWidth * 16) / 100,
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

type Props<T> = React.HTMLAttributes<HTMLDivElement> & {
  item: T;
  itemType?: string;
  text?: string | null;
  textClasses?: string;
  sound?: string | null;
  image?: string | null;
  disabled?: boolean;
  onClear?: () => void;
};

export function DraggableCard<T>({
  item,
  text,
  sound,
  image,
  hidden,
  onClear,
  disabled,
  textClasses,
  itemType = "ANSWER_CARD",
  ...props
}: Props<T>) {
  const { classes, cx } = useStyles();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: itemType,
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

  const [hasSmallHeight, setHasSmallHeight] = useState(false);
  const soundRef = useRef<HTMLAudioElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (sound) {
      void soundRef.current?.play();
    }
    props?.onClick?.(e);
  }

  const handleImageLoad = useCallback(() => {
    const minimumHeight = 55;
    if (isImageSmall(imageRef.current, minimumHeight)) {
      setHasSmallHeight(true);
    }
  }, [imageRef.current]);

  const isImageSmall = (imgElement: HTMLImageElement | null, minimumHeight: number) => {
    if (imgElement) {
      return imgElement.height <= minimumHeight;
    }
    return false;
  };

  return (
    <div
      {...props}
      className={cx(classes.card, props.className)}
      style={styles}
      ref={disabled ? null : drag}
      onDragStart={onClick}
      onClickCapture={onClick}
    >
      {image && (
        <img
          src={image}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            maxWidth: boardW(100),
            maxHeight: hasSmallHeight ? boardW(90) : boardW(60),
            marginInline: "auto",
            objectFit: "contain",
          }}
          ref={imageRef}
          onLoad={handleImageLoad}
        />
      )}
      {text && <Text className={cx(classes.text, textClasses)}>{text}</Text>}
      {onClear && (
        <button className={classes.close} onClick={onClear}>
          <IconTrash size={16} />
        </button>
      )}
      {sound && (
        <audio src={sound} ref={soundRef} className={classes.audio}></audio>
      )}
    </div>
  );
}
