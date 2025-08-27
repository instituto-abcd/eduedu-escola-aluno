import { Slider, createStyles } from "@mantine/core";
import {
  IconRotateClockwise,
  IconPlayerPlayFilled,
  IconRotate,
  IconPlayerPauseFilled,
} from "@tabler/icons-react";
import { IconButton } from "../EduButton";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { intervalToDuration, formatDuration } from "date-fns";
import { boardW, lousaWidth } from "~/constants/dimensions";
import { useCreateSound } from "~/hooks/useCreateSound";
import { cx } from "~/utils/cx";

const useStyles = createStyles({
  bar: {
    backgroundColor: "#6FCAF8",
  },
});

export type AudioControlRef = HTMLDivElement & {
  sound: ReturnType<typeof useCreateSound>["sound"];
};

type AudioControlProps = React.AudioHTMLAttributes<HTMLAudioElement> & {
  ref?: React.Ref<{ playPause: () => void }>;
  iconClassName?: string | undefined;
  iconWidth?: number | undefined;
  iconHeight?: number | undefined;
};

export const AudioControls = forwardRef((props: AudioControlProps, ref) => {
  const [currentTime, setCurrentTime] = useState(0);

  const { sound } = useCreateSound({
    src: props.src ?? "",
    autoPlay: props.autoPlay ?? false,
  });

  function rewind() {
    const duration = sound.duration();
    const seek = sound.seek();
    const newSeek = seek - 15 >= duration ? duration : seek - 15;
    sound.seek(newSeek);
  }

  function forward() {
    const duration = sound.duration();
    const seek = sound.seek();
    const newSeek = seek + 15 >= duration ? duration : seek + 15;
    sound.seek(newSeek);
  }

  sound.onPlay(() => requestAnimationFrame(handleProgress));
  sound.onSeek(() => requestAnimationFrame(handleProgress));

  function handleProgress() {
    const seek = sound.seek();
    setCurrentTime(seek);

    if (sound.playing()) {
      requestAnimationFrame(handleProgress);
    }
  }

  const playPause = useCallback(() => {
    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
  }, [sound]);

  const { classes } = useStyles();
  useImperativeHandle(ref, () => ({
    sound,
  }));

  return (
    <div className={cx("flex flex-col items-center gap-8", props.className)}>
      <div className="flex items-center gap-2">
        <IconButton
          icon={
            <IconRotateClockwise
              style={{ transform: "rotateX(180deg)" }}
              width={props.iconWidth || lousaWidth * 0.04}
              height={props.iconHeight || lousaWidth * 0.029}
            />
          }
          onClick={rewind}
          className={props.iconClassName}
        />
        <IconButton
          icon={
            sound.playing() ? (
              <IconPlayerPauseFilled
                width={props.iconWidth || lousaWidth * 0.04}
                height={props.iconHeight || lousaWidth * 0.029}
              />
            ) : (
              <IconPlayerPlayFilled
                width={props.iconWidth || lousaWidth * 0.04}
                height={props.iconHeight || lousaWidth * 0.029}
              />
            )
          }
          variant="yellow"
          onClick={playPause}
          className={props.iconClassName}
        />
        <IconButton
          icon={
            <IconRotate
              style={{ transform: "rotateX(180deg)" }}
              width={props.iconWidth || lousaWidth * 0.04}
              height={props.iconHeight || lousaWidth * 0.029}
            />
          }
          onClick={forward}
          className={props.iconClassName}
        />
      </div>
      <Slider
        value={currentTime}
        onChange={(e) => {
          sound.seek(e);
        }}
        className="w-full"
        radius="xs"
        classNames={{ bar: classes.bar }}
        thumbSize={30}
        step={0.1}
        max={sound.duration()}
        label={(value) => {
          const seconds = (value / 100) * sound.duration();

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
    </div>
  );
});
