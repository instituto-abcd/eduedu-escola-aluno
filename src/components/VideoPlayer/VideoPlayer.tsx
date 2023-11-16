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
import { ReactNode, useRef, useState } from "react";
import { boardW } from "~/constants/dimensions";
import { useDebugInfo } from "~/stores/debug-info";

const useStyles = createStyles({
  wrapper: {
    position: "relative",
  },
  video: {
    height: boardW(250),
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

  function stop() {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  }

  function pause() {
    ref.current?.pause();
  }

  return (
    <Debug isPlaying={isPlaying} stop={stop} pause={pause} canPlay={canPlay}>
      <div className={cx(className, classes.wrapper)}>
        <video
          {...props}
          ref={ref}
          className={classes.video}
          style={{ ...props.style }}
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
    <HoverCard width={200} shadow="md" position="left">
      <HoverCard.Target>
        <div>{children}</div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table withBorder fontSize={12}>
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
