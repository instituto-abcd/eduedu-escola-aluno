import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "../EduButton";
import { IconButtonProps } from "../EduButton/IconButton";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { lousaWidth } from "~/constants/dimensions";

type Props = {
  buttonProps?: IconButtonProps;
  autoPlay?: boolean;
  src?: string;
};

type Ref = { play: () => void };

// TODO: bug na chave autoplay (não está funcionando como deveria)

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
    }, [src]);

    useImperativeHandle(ref, () => ({
      play,
    }));

    return (
      <IconButton
        variant="gray"
        onClick={play}
        disabled={mediaTrack.isPlaying}
        {...buttonProps}
        icon={
          buttonProps?.icon ?? (
            <OuvirIcon width={lousaWidth * 0.04} height={lousaWidth * 0.029} />
          )
        }
      />
    );
  }
);
