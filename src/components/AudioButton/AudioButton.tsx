import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "../EduButton";
import { IconButtonProps } from "../EduButton/IconButton";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { forwardRef, useEffect, useImperativeHandle } from "react";

type Props = {
  buttonProps?: IconButtonProps;
  autoPlay?: boolean;
  src?: string;
};

type Ref = { play: () => void };

export const AudioButton = forwardRef<Ref, Props>(
  ({ buttonProps, autoPlay, src }, ref) => {
    const mediaTrack = useMediaTrackStore();

    const play = () => {
      if (src) {
        mediaTrack.play({
          mediaType: MediaType.AUDIO,
          trackId: `[AUDIO]-${src}`,
          trackUrl: src,
        });
      }
    };

    useEffect(() => {
      if (autoPlay) {
        play();
      }
    }, []);

    useImperativeHandle(ref, () => ({
      play,
    }));

    return (
      <IconButton
        variant="gray"
        onClick={play}
        disabled={mediaTrack.isPlaying}
        {...buttonProps}
        icon={buttonProps?.icon ?? <OuvirIcon />}
      />
    );
  }
);
