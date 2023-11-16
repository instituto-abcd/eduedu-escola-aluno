import {
  ActionIcon,
  Paper,
  Text,
  createStyles,
  PaperProps,
  TextProps,
} from "@mantine/core";
import {
  IconSquare1Filled,
  IconSquare2Filled,
  IconTrash,
} from "@tabler/icons-react";
import { useDrag } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { useCreateSound } from "~/hooks/useCreateSound";
import { useDebugInfo } from "~/stores/debug-info";

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
    isolation: "isolate",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.blue[6],
    backgroundColor: theme.colors.gray[0],
    boxShadow: "0px 5px 0px 0px #228BE6",
    placeItems: "center",
    position: props.stacked ? "absolute" : "initial",
    width: props.stacked ? "100%" : props.width ?? boardW(170),
    height: props.stacked ? "100%" : props.height ?? boardW(153),
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
  debugDiv: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: "translate(50%, 50%)",
    zIndex: 5,
    pointerEvents: "none",
    color: "#25abe6",
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
  textProps?: Partial<TextProps>;
  debugProperty?: "isCorrect" | "position";
} & Partial<PaperProps>;

export function Card({
  option,
  order,
  onClear,
  onDragStart,
  imageOnly,
  textProps,
  stacked = false,
  draggable = true,
  variant = "square",
  debugProperty = "isCorrect",
  ...props
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

  const { classes, cx } = useStyles({
    stacked,
    isDragging,
    order,
    width: variant === "square" ? boardW(170) : boardW(308),
    height: variant === "square" ? boardW(153) : boardW(210),
  });

  const { sound, isPlaying } = useCreateSound({
    src: option.sound_url ?? "",
    skipPlayStatus: true,
  });

  const debug = useDebugInfo((s) => s.answer);

  return (
    <Paper
      className={cx(classes.card, props.className)}
      ref={draggable ? drag : null}
      onDragStart={() => {
        if (option.sound_url) {
          sound.play();
        }
        onDragStart?.(option);
      }}
      style={{
        pointerEvents: isPlaying ? "none" : "all",
      }}
    >
      {!imageOnly && (
        <Text
          size={boardW(30)}
          weight={600}
          color="blue.6"
          align="center"
          {...textProps}
        >
          {option.description}
        </Text>
      )}

      {option.image_url && (
        <img
          src={option.image_url}
          width={boardW(130)}
          height="auto"
          style={{ maxHeight: boardW(140), objectFit: "contain" }}
        />
      )}

      {onClear && (
        <ActionIcon onClick={onClear} className={classes.clear}>
          <IconTrash size={16} />
        </ActionIcon>
      )}

      {debug && (
        <div className={classes.debugDiv}>
          {debugProperty === "isCorrect" && <>option.isCorrect ? "✅" : "❌"</>}
          {debugProperty === "position" && (
            <>
              {+option.position === 1 ? (
                <IconSquare1Filled />
              ) : (
                <IconSquare2Filled />
              )}
            </>
          )}
        </div>
      )}
    </Paper>
  );
}
