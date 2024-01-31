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
    if (mainAudioRef.current && auxAudioRef.current) {
      if (shouldPlay) {
        mainAudioRef.current.sound.onEnd(() => {
          auxAudioRef.current!.sound.play();
        });
      }
    }

    return () => {
      auxAudioRef.current?.sound.destroy();
    };
  }, [question]);

  return {
    shouldPlay, shouldPlayAuxiliar, mainAudioRef, auxAudioRef
  };
}
