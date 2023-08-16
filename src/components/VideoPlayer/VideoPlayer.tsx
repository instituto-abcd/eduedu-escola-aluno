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
});

type Props = React.VideoHTMLAttributes<HTMLVideoElement>;

export function VideoPlayer(props: Props) {
  const { classes } = useStyles();
  const ref = useRef<HTMLVideoElement>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={classes.wrapper}>
      <video
        {...props}
        ref={ref}
        width={320}
        height={340}
        onLoadedData={() => setIsLoadingData(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        autoPlay
      ></video>
      <div className={classes.controls}>
        {isLoadingData && <Loader />}
        {!isPlaying && (
          <IconRotateClockwise
            size={100}
            style={{ cursor: "pointer", opacity: 0.9 }}
            onClick={() => void ref.current?.play()}
          />
        )}
      </div>
    </div>
  );
}
