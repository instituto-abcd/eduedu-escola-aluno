import { createStyles } from "@mantine/core";
import { boardW } from "~/constants/dimensions";
import { useDebugInfo } from "~/stores/debug-info";
import { QuestionOption } from "~/api/exam";
import { useCreateSound } from "~/hooks/useCreateSound";

const useStyles = createStyles({
  button: {
    width: boardW(170),
    height: boardW(148),
    borderRadius: 8,
    border: "1px solid #228BE6",
    backgroundColor: "#fff",
    cursor: "pointer",
    boxShadow: "0px 5px 0px 0px #228BE6",
    display: "grid",
    placeItems: "center",
    fontSize: boardW(20),
    fontWeight: 600,
    color: "#228BE6",
    userSelect: "none",
    "*": {
      color: "#228BE6",
    },
    ":not(:disabled):active": {
      boxShadow: "0px 2px 0px 0px #228BE6",
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
  debugDiv: {
    position: "relative",
    isolation: "isolate",
    p: {
      position: "absolute",
      top: 0,
      marginInline: "auto",
      zIndex: 55,
    },
  },
});

export type OptionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    option: QuestionOption;
  };

export function OptionButton({ option, ...props }: OptionButtonProps) {
  const { classes, cx } = useStyles();
  const { sound, isPlaying } = useCreateSound({
    src: option.sound_url ?? "",
  });

  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!props.disabled && !isPlaying) {
      sound.play();
    }
    props?.onClick?.(e);
  }

  const debug = useDebugInfo((s) => s.answer);

  return (
    <div className={classes.debugDiv}>
      <button
        {...props}
        className={cx(classes.button, props.className)}
        onClick={onClick}
        disabled={props.disabled || isPlaying}
      />

      {debug && <p>{option.isCorrect ? "✅" : "❌"}</p>}
    </div>
  );
}
