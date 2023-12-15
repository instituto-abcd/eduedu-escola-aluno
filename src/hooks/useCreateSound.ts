import { useEffect, useMemo } from "react";
import { AudioInterface } from "~/sounds";
import { useAudioStatus } from "~/stores/audio";
import { useTimeout } from "@mantine/hooks";

type AudioMetadata = {
  src: string | string[];
  autoPlay?: boolean;
  skipPlayStatus?: boolean;
};

export function useCreateSound(metadata: AudioMetadata) {
  const { isPlaying, setPlaying } = useAudioStatus();

  const sound = useMemo(() => {
    const audio = AudioInterface.createSound({
      src: Array.isArray(metadata.src) ? metadata.src : [metadata.src],
    });

    return audio;
  }, [metadata.src, metadata.autoPlay]);

  /*
   * Fallback pra autoPlay quando o MODEL acabou de ser montado
   * ex: questão anterior era MODELX, e a atual é MODELY
   */
  const { start } = useTimeout(() => {
    if (sound && metadata.autoPlay && !isPlaying && !sound.playing()) {
      sound.play();
    }
  }, 500);

  useEffect(() => {
    sound.onPlay(() => {
      !metadata.skipPlayStatus && setPlaying(true);
    });
    sound.onStop(() => {
      !metadata.skipPlayStatus && setPlaying(false);
    });
    sound.onPause(() => {
      !metadata.skipPlayStatus && setPlaying(false);
    });
    sound.onEnd(() => {
      !metadata.skipPlayStatus && setPlaying(false);
    });

    return () => {
      sound.destroy();
    };
  }, [metadata.src, metadata.autoPlay]);

  useEffect(() => {
    start();
  }, [sound, metadata.autoPlay, metadata.src]);

  return {
    sound,
    isPlaying,
  };
}
