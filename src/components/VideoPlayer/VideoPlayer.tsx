import {
  Button,
  Group,
  HoverCard,
  Loader,
  Table,
  createStyles,
} from "@mantine/core";
import {
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useAudioStatus } from "~/stores/audio";
import { useDebugInfo } from "~/stores/debug-info";

const useStyles = createStyles({
  wrapper: {
    position: "relative",
  },
  video: {
    wdth: "100%",
    height: "auto",
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

type Props = React.VideoHTMLAttributes<HTMLVideoElement>;

export function VideoPlayer({ className, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const { classes, cx } = useStyles();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });

  const audioStatus = useAudioStatus();

  const handleLoadedMetadata = () => {
    const video = ref.current;
    if (video) {
      const aspectRatio = video.videoWidth / video.videoHeight;

      const isHorizontal = aspectRatio > 1;

      const maxContainerWidth = 1024;
      const maxContainerHeight = 600;

      let containerWidth, containerHeight;

      if (isHorizontal) {
        containerWidth = maxContainerWidth;
        containerHeight = maxContainerWidth / aspectRatio;
      } else {
        containerHeight = maxContainerHeight;
        containerWidth = maxContainerHeight * aspectRatio;
      }

      setVideoDimensions({
        width: containerWidth,
        height: containerHeight,
      });
    }
  };

  function play() {
    if (!audioStatus.isPlaying) {
      void ref.current?.play();
    }
  }

  function stop() {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  }

  function pause() {
    ref.current?.pause();
  }

  useEffect(() => {
    return () => {
      if (audioStatus.isPlaying) {
        audioStatus.setPlaying(false);
      }
    };
  }, []);

  return (
    <Debug
      isPlaying={audioStatus.isPlaying}
      stop={stop}
      pause={pause}
      canPlay={!audioStatus.isPlaying}
    >
      <div className={cx(className, classes.wrapper)}>
        <video
          {...props}
          ref={ref}
          className={classes.video}
          style={{ ...props.style, objectFit: "contain" }}
          disablePictureInPicture
          onLoadedData={() => setIsLoadingData(false)}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={(e) => {
            props.onPlay?.(e);
            audioStatus.setPlaying(true);
          }}
          onPause={(e) => {
            props.onPause?.(e);
            audioStatus.setPlaying(false);
          }}
          onEnded={(e) => {
            props.onEnded?.(e);
            audioStatus.setPlaying(false);
          }}
          width={videoDimensions.width}
          height={videoDimensions.height}
        ></video>

        <div className={classes.controls}>
          {isLoadingData && <Loader />}
          {!audioStatus.isPlaying && !isLoadingData && (
            <IconRotateClockwise
              size={100}
              className={classes.icon}
              onClick={play}
            />
          )}
        </div>
      </div>
    </Debug>
  );
}

function Debug({
  children,
  isPlaying,
  canPlay,
  stop,
  pause,
}: {
  children: ReactNode;
  isPlaying: boolean;
  canPlay: boolean;
  stop: () => void;
  pause: () => void;
}) {
  const debug = useDebugInfo((s) => s.VideoPlayer);
  if (!debug) return children;

  return (
    <HoverCard
      width={200}
      shadow="md"
      position="left"
    >
      <HoverCard.Target>
        <div>{children}</div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table
          withBorder
          fontSize={12}
        >
          <tbody>
            <tr>
              <td>Playing?</td>
              <td>{isPlaying ? "✅" : "❌"}</td>
            </tr>
            <tr>
              <td>Can play?</td>
              <td>{canPlay ? "✅" : "❌"}</td>
            </tr>
          </tbody>
        </Table>
        <Group noWrap>
          <Button
            onClick={stop}
            compact
            color="red"
            mt="sm"
            disabled={!isPlaying}
            leftIcon={<IconPlayerStopFilled size={16} />}
          >
            Stop
          </Button>
          <Button
            onClick={pause}
            compact
            mt="sm"
            variant="outline"
            disabled={!isPlaying}
            leftIcon={<IconPlayerPauseFilled size={16} />}
          >
            Pause
          </Button>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
