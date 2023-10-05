import { Loader, createStyles } from "@mantine/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { boardW } from "~/constants/dimensions";

const useStyles = createStyles({
  wrapper: {
    position: "relative",
  },
  controls: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    zIndex: 1,
    color: "white",
  },
  icon: {
    cursor: "pointer",
    opacity: 0.9,
  },
});

type Props = React.VideoHTMLAttributes<HTMLVideoElement> & {
  onPlayStatusChange?: (isPlaying: boolean) => void;
  canPlay?: boolean;
};

export function VideoPlayer({
  onPlayStatusChange,
  canPlay = true,
  className,
  ...props
}: Props) {
  const { classes, cx } = useStyles();
  const ref = useRef<HTMLVideoElement>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  function play() {
    if (canPlay) {
      void ref.current?.play();
    }
  }

  return (
    <div className={cx(className, classes.wrapper)}>
      <video
        {...props}
        ref={ref}
        style={{ height: boardW(250), ...props.style }}
        onLoadedData={() => setIsLoadingData(false)}
        onPlay={(e) => {
          props.onPlay?.(e);
          onPlayStatusChange?.(true);
          setIsPlaying(true);
        }}
        onPause={(e) => {
          props.onPause?.(e);
          onPlayStatusChange?.(false);
          setIsPlaying(false);
        }}
        onEnded={(e) => {
          props.onEnded?.(e);
          onPlayStatusChange?.(false);
          setIsPlaying(false);
        }}
      ></video>
      <div className={classes.controls}>
        {isLoadingData && <Loader />}
        {!isPlaying && (
          <IconRotateClockwise
            size={100}
            className={classes.icon}
            onClick={play}
          />
        )}
      </div>
    </div>
  );
}
