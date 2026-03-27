import { useLayoutEffect, useRef } from "react";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { useQuestionHelper } from "./useQuestionHelper";
import { Question } from "~/api/exam";

export function useAuxiliarAudio(question: Question) {
  const { getRule } = useQuestionHelper(question);
  const autoplayRule = getRule("autoplay");
  const autoplayAuxRule = getRule("autoplayAux");
  const shouldPlay = autoplayRule?.value === "false" ? false : true;
  const shouldPlayAuxiliar = autoplayAuxRule?.value === "false" ? false : true;

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxAudioRef = useRef<AudioButtonRef>(null);

  useLayoutEffect(() => {
    const mainSound = mainAudioRef.current?.sound;
    const auxSound = auxAudioRef.current?.sound;

    if (!mainSound || !auxSound || !shouldPlay) {
      return () => {
        auxSound?.destroy();
      };
    }

    const handler = () => auxSound.play();
    mainSound.onEnd(handler);

    return () => {
      mainSound.off("end", handler);
      auxSound.destroy();
    };
  }, [question]);

  return {
    shouldPlay, shouldPlayAuxiliar, mainAudioRef, auxAudioRef
  };
}
