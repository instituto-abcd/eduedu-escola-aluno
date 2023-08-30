import { ActionIcon, Paper, Text, createStyles, Image } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
import { useDrag } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { useMediaTrackStore } from "~/stores/media-track.store";

type StyleProps = {
  stacked?: boolean;
  width?: number;
  height?: number;
  isDragging?: boolean;
  hidden?: boolean;
  order?: number;
};

const useStyles = createStyles((theme, props: StyleProps) => ({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.blue[6],
    backgroundColor: theme.colors.gray[0],
    boxShadow: "0px 5px 0px 0px #228BE6",
    placeItems: "center",
    position: props.stacked ? "absolute" : "initial",
    width: props.stacked ? "100%" : props.width ?? 170,
    height: props.stacked ? "100%" : props.height ?? 153,
    opacity: props.isDragging ? 1 : props.hidden ? 0.1 : 1,
    display: "grid",
    cursor: props.isDragging ? "move" : "grab",
    pointerEvents: props.hidden ? "none" : "all",
    transform: `
      ${props.order ? (props.order === 2 ? "scale(0.948)" : "") : ""}
      ${props.order ? (props.order === 3 ? "scale(0.889)" : "") : ""}
      ${props.order ? (props.order === 2 ? "translateY(-5.5%)" : "") : ""}
      ${props.order ? (props.order === 3 ? "translateY(-12.5%)" : "") : ""}
    `,
    transition: "transform 0.2s ease-in-out",
    zIndex:
      props.order === 1 ? 3 : props.order === 2 ? 2 : props.order === 3 ? 1 : 0,
  },
  clear: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  audio: {
    display: "none",
  },
}));

export type StackCardProps = {
  option: QuestionOption;
  stacked?: boolean;
  draggable?: boolean;
  order?: number;
  onClear?: () => void;
  onDragStart?: (option: QuestionOption) => void;
  variant?: "wide" | "square";
  imageOnly?: boolean;
};

export function Card({
  option,
  order,
  onClear,
  onDragStart,
  imageOnly,
  stacked = false,
  draggable = true,
  variant = "square",
}: StackCardProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ANSWER_CARD",
      item: () => option,

      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [option]
  );

  const { classes } = useStyles({
    stacked,
    isDragging,
    order,
    width: variant === "square" ? 170 : 308,
    height: variant === "square" ? 153 : 210,
  });

  const soundRef = useRef<HTMLAudioElement>(null);
  const mediaTrack = useMediaTrackStore();

  return (
    <Paper
      className={classes.card}
      ref={draggable ? drag : null}
      onDragStart={() => {
        if (option.sound_url) {
          void soundRef.current?.play();
        }
        onDragStart?.(option);
      }}
    >
      {!imageOnly && (
        <Text size={30} weight={600} color="blue.6" align="center">
          {option.description}
        </Text>
      )}

      {option.image_url && (
        <Image src={option.image_url} width={130} height="auto" />
      )}

      {onClear && (
        <ActionIcon onClick={onClear} className={classes.clear}>
          <IconTrash size={16} />
        </ActionIcon>
      )}

      {option.sound_url && (
        <audio
          src={option.sound_url}
          ref={soundRef}
          className={classes.audio}
          onPlay={() => mediaTrack.setPlayStatus(true)}
          onPause={() => mediaTrack.setPlayStatus(false)}
          onEnded={() => mediaTrack.setPlayStatus(false)}
        ></audio>
      )}
    </Paper>
  );
}
