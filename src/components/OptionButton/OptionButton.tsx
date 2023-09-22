import { createStyles } from "@mantine/core";
import { forwardRef, useRef } from "react";
import { useMediaTrackStore } from "~/stores/media-track.store";

const useStyles = createStyles({
  button: {
    width: 170,
    height: 148,
    borderRadius: 8,
    border: "1px solid #228BE6",
    backgroundColor: "#fff",
    cursor: "pointer",
    boxShadow: "0px 5px 0px 0px #228BE6",
    display: "grid",
    placeItems: "center",
    fontSize: 20,
    fontWeight: 600,
    color: "#228BE6",
    userSelect: "none",
    wordBreak: "break-all",
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
    p: {
      position: "absolute",
      top: 0,
      marginInline: "auto",
      zIndex: 999,
    },
  },
});

export type OptionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    sound?: string;
    isCorrect?: boolean;
  };

export const OptionButton = forwardRef<HTMLButtonElement, OptionButtonProps>(
  ({ isCorrect, ...props }, ref) => {
    const { classes, cx } = useStyles();
    const soundRef = useRef<HTMLAudioElement>(null);
    const mediaTrack = useMediaTrackStore();

    function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      if (props.sound && mediaTrack.canPlay()) {
        void soundRef.current?.play();
      }
      props?.onClick?.(e);
    }

    return (
      <div className={classes.debugDiv}>
        <button
          {...props}
          className={cx(classes.button, props.className)}
          onClick={onClick}
          disabled={props.disabled || mediaTrack.isPlaying}
          ref={ref}
        />
        {import.meta.env.DEV && typeof isCorrect === "boolean" && (
          <p>{isCorrect ? "✅" : "❌"}</p>
        )}
        {props.sound && (
          <audio
            src={props.sound}
            ref={soundRef}
            className={classes.audio}
          ></audio>
        )}
      </div>
    );
  }
);
