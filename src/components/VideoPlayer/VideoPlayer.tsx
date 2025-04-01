import { Button, Group, HoverCard, Loader, Table } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import {
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useAudioStatus } from "~/stores/audio";
import { useDebugInfo } from "~/stores/debug-info";
import { cx } from "~/utils/cx";

export type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export function VideoPlayer({
  className,
  autoPlay,
  ...props
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const audioStatus = useAudioStatus();
  const isHorizontal =
    ref.current && ref.current.videoWidth > ref.current.videoHeight;

  function play() {
    void ref.current?.play();
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

  /* Programatically invoke autoplay */
  useTimeout(() => play(), 350, { autoInvoke: !!autoPlay });

  useEffect(() => {
    return () => {
      audioStatus.setPlaying(false);
    };
  }, []);

  return (
    <div className="relative size-full flex flex-col items-center">
      <video
        {...props}
        ref={ref}
        className={cx(
          "w-full h-auto",
          {
            ["w-auto h-full"]: !isHorizontal,
          },
          className
        )}
        controls={false}
        disablePictureInPicture
        onLoadedData={() => setIsLoadingData(false)}
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
      ></video>

      <div className="absolute inset-0 grid place-items-center z-10 text-white">
        {isLoadingData && <Loader />}
        {!audioStatus.isPlaying && !isLoadingData && (
          <IconRotateClockwise
            size={100}
            className="pointer opacity-90 stroke-blue-300"
            onClick={play}
          />
        )}
      </div>
    </div>
  );
}

// TODO: add debuger
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
