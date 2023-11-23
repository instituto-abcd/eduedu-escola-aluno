import { Image, Text, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { useAudioStatus } from "~/stores/audio";
import { useDebugInfo } from "~/stores/debug-info";
import { DebugDiv } from "../Debug/DebugDiv";
import { DebugProps } from "../Debug";

const useStyles = createStyles((theme) => ({
  option: {
    paddingInline: boardW(24),
    paddingBlock: boardW(10),
    fontSize: boardW(40),
    borderWidth: 1,
    borderColor: theme.colors.blue[6],
    borderStyle: "solid",
    borderRadius: 16,
    boxShadow: `0px 5px 0px 0px ${theme.colors.blue[6]}`,
    backgroundColor: "#fff",
    color: theme.colors.blue[6],
    cursor: "grab",
    fontWeight: 600,
    userSelect: "none",
    position: "relative",
    isolation: "isolate",
    "&[data-disabled=true]": {
      backgroundColor: "#E9E9E9",
      color: "#C4C4C4",
      boxShadow: "0px 5px 0px 0px #c4c4c4",
      borderColor: "#c4c4c4",
      img: {
        opacity: 0.5,
      },
      "*": {
        color: "#C4C4C4",
      },
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
  },
  debugDiv: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: "translate(-50%, -50%) scale(0.75)",
    zIndex: 5,
    pointerEvents: "none",
  },
}));

type DraggableLettersProps = React.HTMLAttributes<HTMLDivElement> & {
  onClear?: () => void;
  option: QuestionOption;
  type?: string;
  disabled?: boolean;
  debug?: DebugProps;
};

export function DraggableLetters({
  onClear,
  option,
  type = "ANSWER_LETTERS",
  hidden,
  disabled,
  debug,
  ...props
}: DraggableLettersProps) {
  const { classes, cx } = useStyles();
  const isPlaying = useAudioStatus((s) => s.isPlaying);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: () => option,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: !hidden && !disabled,
    }),
    [option, hidden, disabled]
  );

  const styles: CSSProperties = {
    opacity: isDragging ? 0.4 : hidden ? 0.1 : 1,
    cursor: isDragging ? "move" : "grab",
    pointerEvents: hidden || isPlaying ? "none" : "all",
  };

  const canDebug = useDebugInfo((s) => s.answer);

  return (
    <div
      {...props}
      style={{ ...props.style, ...styles }}
      className={cx(classes.option, props.className)}
      ref={drag}
      data-disabled={isPlaying}
    >
      {option.image_url && (
        <Image
          src={option.image_url}
          alt={option.image_name ?? ""}
          style={{ maxWidth: boardW(65) }}
        />
      )}
      {!option.image_url && option.description && (
        <Text p={0} m={0}>
          {option.description}
        </Text>
      )}
      {onClear && (
        <button className={classes.close} onClick={onClear}>
          <IconTrash size={16} />
        </button>
      )}
      {canDebug && !debug?.skipDebug && (
        <DebugDiv
          position={
            debug?.debugProperty === "position" ? option.position : undefined
          }
          debug={debug}
        >
          {debug?.overwriteIsCorrect || option.isCorrect}
        </DebugDiv>
      )}
    </div>
  );
}
