import { createStyles } from "@mantine/core";
import { useRef } from "react";

const useStyles = createStyles((theme) => ({
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
    fontSize: 30,
    fontWeight: 600,
    color: "#228BE6",
    userSelect: "none",
    wordBreak: "break-all",
    ":active": {
      boxShadow: "0px 2px 0px 0px #228BE6",
      transform: "translateY(3px)",
    },
    "&[data-selected=true]": {
      backgroundColor: theme.colors.gray[1],
    },
  },
  audio: {
    display: "none",
  },
}));

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  sound?: string;
};

export function OptionButton(props: Props) {
  const { classes, cx } = useStyles();
  const soundRef = useRef<HTMLAudioElement>(null);

  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (props.sound) {
      void soundRef.current?.play();
    }
    props?.onClick?.(e);
  }

  return (
    <>
      <button
        {...props}
        className={cx(classes.button, props.className)}
        onClick={onClick}
      />
      {props.sound && (
        <audio
          src={props.sound}
          ref={soundRef}
          className={classes.audio}
        ></audio>
      )}
    </>
  );
}
