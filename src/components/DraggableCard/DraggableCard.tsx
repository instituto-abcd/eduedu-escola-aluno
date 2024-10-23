import { Text, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useDrag } from "react-dnd";
import { useCreateSound } from "~/hooks/useCreateSound";
import { useDebugInfo } from "~/stores/debug-info";
import { DebugDiv } from "../Debug/DebugDiv";
import { QuestionOption } from "~/api/exam";
import { DebugProps } from "../Debug";
import { BREAKPOINT } from "~/constants/dimensions";

type Props<T> = React.HTMLAttributes<HTMLDivElement> & {
  item: T;
  itemType?: string;
  text?: string | null;
  textClasses?: string;
  sound?: string | null;
  image?: string | null;
  disabled?: boolean;
  onClear?: () => void;
  debug?: DebugProps;
  noPaddingRule?: boolean | false;
  size?: number;
};

export function DraggableCard<T>({
  item,
  text,
  sound: _sound,
  debug,
  image,
  hidden,
  onClear,
  disabled,
  textClasses,
  itemType = "ANSWER_CARD",
  noPaddingRule,
  size,
  ...props
}: Props<T>) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: itemType,
      item: () => item,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [item],
  );

  const { sound, isPlaying } = useCreateSound({
    src: _sound ?? "",
    skipPlayStatus: true,
  });

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (sound) sound.play();
    props?.onClick?.(e);
  }

  /* debug */
  const canDebug = useDebugInfo((s) => s.answer);

  const { classes, cx } = useStyles({
    isDragging,
    noPadding: !!noPaddingRule,
    hidden,
    isPlaying,
    size,
  });
  return (
    <div
      {...props}
      className={cx(classes.card, props.className)}
      ref={disabled ? null : drag}
      onDragStart={onClick}
      onClickCapture={onClick}
    >
      {image && <img src={image} className={classes.img} />}
      {text && !image && (
        <Text className={cx(classes.text, textClasses)}>{text}</Text>
      )}
      {onClear && (
        <button className={classes.close} onClick={onClear}>
          <IconTrash size={16} />
        </button>
      )}

      {canDebug && !debug?.skipDebug && item && (
        <DebugDiv
          position={+(item as unknown as QuestionOption).position}
          debug={debug}
        >
          {(item as unknown as QuestionOption).isCorrect}
        </DebugDiv>
      )}
    </div>
  );
}

type StyleProps = {
  isDragging: boolean;
  noPadding: boolean;
  hidden?: boolean;
  isPlaying: boolean;
  size?: number;
};

const useStyles = createStyles((theme, props: StyleProps) => ({
  card: {
    borderRadius: 20,
    backgroundColor: "#F8F6F2",
    boxShadow: "0px 8px 0px 0px #4C494166",
    display: "grid",
    placeItems: "center",
    position: "relative",
    width: props.size ? `calc(max-content / ${props.size})` : 105,
    height: 192,
    opacity: props.isDragging ? 0.4 : props.hidden ? 0.1 : 1,
    cursor: props.isDragging ? "move" : "grab",
    pointerEvents: props.hidden || props.isPlaying ? "none" : "all",
    padding: props.noPadding ? 0 : 16,
    overflow: "hidden",
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      width: props.size ? `calc(max-content / ${props.size})` : 190,
      height: 192,
      borderRadius: 45,
    },
    [theme.fn.largerThan(BREAKPOINT.TABLET_HORZ)]: {
      width: 190,
    },
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
    zIndex: 9,
  },
  text: {
    fontSize: 30,
    fontWeight: 600,
    color: "#228BE6",
    userSelect: "none",
    pointerEvents: "none",
  },
  img: {
    pointerEvents: "none",
    userSelect: "none",
    maxWidth: "100%",
    maxHeight: props.noPadding ? "auto" : "100%",
    marginInline: props.noPadding ? 0 : "auto",
    width: props.noPadding ? "100%" : undefined,
    overflow: props.noPadding ? "clip" : undefined,
    padding: props.noPadding ? 0 : 6,
    objectFit: "cover",
    position: "absolute",
    inset: 0,
    marginBlock: "auto",
    borderRadius: props.noPadding ? 0 : 20,
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      borderRadius: props.noPadding ? 0 : 45,
    },
  },
}));
