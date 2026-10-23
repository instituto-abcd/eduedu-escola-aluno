import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AudioInterface } from "~/sounds";
import { useAudioStatus } from "~/stores/audio";

type AudioMetadata = {
  src: string | string[];
  autoPlay?: boolean;
  skipPlayStatus?: boolean;
};

const AUTOPLAY_DELAY_MS = 500;
// Prazo para o autoplay começar (rede lenta, iOS sem gesto do usuário). Depois
// dele o aluno é liberado para responder e o áudio não toca mais sozinho.
const AUTOPLAY_TIMEOUT_MS = 5000;

function hasSource(src: string | string[]) {
  return Array.isArray(src) ? src.some(Boolean) : Boolean(src);
}

export function useCreateSound(metadata: AudioMetadata) {
  const { isPlaying, setPlaying, setPending } = useAudioStatus();

  const sound = useMemo(() => {
    const audio = AudioInterface.createSound({
      src: Array.isArray(metadata.src) ? metadata.src : [metadata.src],
    });

    return audio;
  }, [metadata.src, metadata.autoPlay]);

  // O contador de pendentes é global: só devolve quem registrou.
  const isPendingRef = useRef(false);
  function setAutoPlayPending(pending: boolean) {
    if (metadata.skipPlayStatus || isPendingRef.current === pending) return;
    isPendingRef.current = pending;
    setPending(pending);
  }

  useEffect(() => {
    sound.onPlay(() => {
      !metadata.skipPlayStatus && setPlaying(true);
      // Só depois de contar como tocando, para o store não piscar como parado.
      setAutoPlayPending(false);
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

  /*
   * Fallback pra autoPlay quando o MODEL acabou de ser montado
   * ex: questão anterior era MODELX, e a atual é MODELY
   *
   * Decidido uma única vez, com os valores do primeiro render. Do mount até o
   * áudio começar (atraso + carregamento) o som conta como tocando: sem isso as
   * opções ficavam liberadas nesse intervalo e, se o aluno respondesse rápido
   * (ex.: logo após recarregar a página), o enunciado tocava depois da resposta.
   */
  const [shouldAutoPlay] = useState(
    () => !!metadata.autoPlay && !isPlaying && hasSource(metadata.src)
  );

  // Layout effect: o pendente entra antes da primeira pintura (as opções já
  // aparecem bloqueadas) e os listeners antes de qualquer evento do áudio.
  useLayoutEffect(() => {
    if (!shouldAutoPlay) return;

    let cancelled = false;
    const release = () => setAutoPlayPending(false);
    const play = () => {
      if (cancelled) return;
      if (sound.playing()) return release();
      sound.play();
    };

    setAutoPlayPending(true);
    sound.onPlayError(release);
    sound.onLoadError(release);

    const timer = window.setTimeout(() => {
      if (sound.state() === "loaded") return play();

      // Só pede o play depois de carregar: um play() na fila do Howler tocaria
      // quando o áudio fosse desbloqueado pelo primeiro toque do aluno.
      sound.onceLoad(play);
      // Som descarregado pelo cleanup que o StrictMode simula em dev.
      if (sound.state() === "unloaded") sound.load();
    }, AUTOPLAY_DELAY_MS);

    const deadline = window.setTimeout(() => {
      cancelled = true;
      release();
    }, AUTOPLAY_DELAY_MS + AUTOPLAY_TIMEOUT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(deadline);
      sound.off("load", play);
      sound.off("playerror", release);
      sound.off("loaderror", release);
      release();
    };
  }, []);

  return {
    sound,
    isPlaying,
  };
}
