import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "../EduButton";
import { AudioHTMLAttributes, useRef } from "react";
import { createStyles } from "@mantine/core";

const useStyles = createStyles({
  audio: {
    display: "none",
  },
});

type Props = AudioHTMLAttributes<HTMLAudioElement>;

export function AudioButton(props: Props) {
  const { classes } = useStyles();
  const audioRef = useRef<HTMLAudioElement>(null);

  const isPlaying = !audioRef.current?.ended && !audioRef.current?.paused;

  return (
    <>
      <audio {...props} className={classes.audio} ref={audioRef} />
      <IconButton
        icon={<OuvirIcon />}
        variant="gray"
        onClick={() => void audioRef.current?.play()}
        disabled={isPlaying}
      />
    </>
  );
}
