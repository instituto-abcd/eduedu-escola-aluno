import { Loader, createStyles } from "@mantine/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useRef, useState } from "react";

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
  customWidth?: string;
  customHeight?: string;
};

export function VideoPlayer({
  onPlayStatusChange,
  canPlay = true,
  customWidth,
  customHeight,
  ...props
}: Props) {
  const { classes } = useStyles();
  const ref = useRef<HTMLVideoElement>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  function play() {
    if (canPlay) {
      void ref.current?.play();
    }
  }

  return (
    <div className={classes.wrapper}>
      <video
        {...props}
        ref={ref}
        style={{ maxHeight: 500 }}
        width={customWidth ?? 320}
        height={customHeight ?? 340}
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
