import { Group, Slider, Stack, createStyles } from "@mantine/core";
import {
  IconRotateClockwise,
  IconPlayerPlayFilled,
  IconRotate,
  IconPlayerPauseFilled,
} from "@tabler/icons-react";
import { IconButton } from "../EduButton";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { intervalToDuration, formatDuration } from "date-fns";

const useStyles = createStyles({
  bar: {
    backgroundColor: "#6FCAF8",
  },
});

type Props = React.AudioHTMLAttributes<HTMLAudioElement>;
type Ref = HTMLDivElement & { play: () => void };

export const AudioControls = forwardRef<Ref, Props>((props, ref) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function rewind() {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
    }
  }

  function forward() {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
    }
  }

  function onTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(
        Math.round(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        )
      );
    }
  }

  function onChangeSlider(value: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  }

  function playPause() {
    if (audioRef.current?.paused) {
      void audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }

  const { classes } = useStyles();

  const play = () => void audioRef.current?.play();
  useImperativeHandle(ref, () => ({ play, ...ref } as Ref), [ref]);

  return (
    <Stack align="center" spacing="xl" ref={ref}>
      <Group>
        <IconButton
          icon={
            <IconRotateClockwise style={{ transform: "rotateX(180deg)" }} />
          }
          onClick={rewind}
        />
        <IconButton
          icon={
            isPlaying ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />
          }
          variant="yellow"
          onClick={playPause}
        />
        <IconButton
          icon={<IconRotate style={{ transform: "rotateX(180deg)" }} />}
          onClick={forward}
        />
      </Group>
      <Slider
        value={currentTime}
        w={650}
        radius="xs"
        classNames={{ bar: classes.bar }}
        thumbSize={30}
        onChange={onChangeSlider}
        label={(value) => {
          const seconds = (value / 100) * (audioRef.current?.duration ?? 0);

          const duration = intervalToDuration({
            start: 0,
            end: Number.isNaN(seconds) ? 0 : seconds * 1000,
          });

          const zeroPad = (num: number) => String(num).padStart(2, "0");

          const formatted = formatDuration(duration, {
            format: ["minutes", "seconds"],
            zero: true,
            delimiter: ":",
            locale: {
              formatDistance: (_, count: number) => zeroPad(count),
            },
          });

          return formatted;
        }}
      />
      <audio
        controls
        {...props}
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        style={{ display: "none" }}
        onPlay={(e) => {
          props.onPlay?.(e);
          setIsPlaying(true);
        }}
        onPause={(e) => {
          props.onPause?.(e);
          setIsPlaying(false);
        }}
        onEnded={(e) => {
          props.onEnded?.(e);
          setIsPlaying(false);
        }}
      />
    </Stack>
  );
});
