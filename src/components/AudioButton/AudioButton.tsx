import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "../EduButton";
import { AudioHTMLAttributes, useRef, useState } from "react";
import { createStyles } from "@mantine/core";
import { IconButtonProps } from "../EduButton/IconButton";

const useStyles = createStyles({
  audio: {
    display: "none",
  },
});

type Props = AudioHTMLAttributes<HTMLAudioElement> & {
  buttonProps?: IconButtonProps;
};

export function AudioButton({ buttonProps, ...props }: Props) {
  const { classes } = useStyles();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <audio
        {...props}
        className={classes.audio}
        ref={audioRef}
        onLoadedData={() => setIsLoadingData(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <IconButton
        variant="gray"
        onClick={() => void audioRef.current?.play()}
        disabled={isPlaying || isLoadingData}
        {...buttonProps}
        icon={buttonProps?.icon ?? <OuvirIcon />}
      />
    </>
  );
}
