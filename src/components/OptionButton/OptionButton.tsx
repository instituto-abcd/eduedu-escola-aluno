import { useDebugInfo } from "~/stores/debug-info";
import { QuestionOption } from "~/api/exam";
import { useCreateSound } from "~/hooks/useCreateSound";
import { DebugDiv } from "../Debug/DebugDiv";
import { DebugProps } from "../Debug";
import { createStyles } from "@mantine/core";

export type OptionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    option?: QuestionOption;
    debug?: DebugProps;
  } & StyleProps;

export function OptionButton({
  option,
  debug,
  children,
  width = 138,
  height = 120,
  ...props
}: OptionButtonProps) {
  const { classes, cx } = useStyles({
    width,
    height,
  });

  const { sound, isPlaying } = useCreateSound({
    src: option?.sound_url ?? "",
    skipPlayStatus: true,
  });

  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!props.disabled && !isPlaying) {
      sound.play();
    }
    props?.onClick?.(e);
  }

  const canDebug = useDebugInfo((s) => s.answer);

  return (
    <button
      {...props}
      className={cx(classes.button, props.className)}
      onClick={onClick}
      disabled={props.disabled || isPlaying}
    >
      {canDebug && !debug?.skipDebug && option && (
        <DebugDiv debug={debug}>{option.isCorrect}</DebugDiv>
      )}
      {children}
    </button>
  );
}

type StyleProps = {
  width?: number;
  height?: number;
};

const useStyles = createStyles((_, props: StyleProps) => ({
  button: {
    width: props.width,
    height: props.height,
    backgroundColor: "#F8F6F2",
    borderRadius: 45,
    border: "none",
    boxShadow: "0px 8px 0px 0px #4C494166",
    display: "grid",
    placeItems: "center",
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#228BE6",
    cursor: "pointer",
    position: "relative",
    userSelect: "none",
    "*": {
      color: "#228BE6",
    },
    ":not(:disabled):active": {
      boxShadow: "0px 2px 0px 0px #4C494166",
      transform: "translateY(3px)",
    },
    "&[data-selected=true]": {
      backgroundColor: "#DFFEC5",
      border: "1px solid #ACE655",
      boxShadow: "0px 5px 0px 0px #ACE655",
    },
    ":disabled": {
      backgroundColor: "#E9E9E9",
      color: "#C4C4C4",
      boxShadow: "0px 8px 0px 0px #c4c4c4",
      borderColor: "#c4c4c4",
      img: {
        opacity: 0.5,
      },
      "*": {
        color: "#C4C4C4",
      },
    },
  },
  audio: {
    display: "none",
  },
}));
