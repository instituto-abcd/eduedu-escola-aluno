import { Question } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioContainer } from "../AudioContainer";
import { ReadButton } from "../ReadButton";
import { useEffect, useMemo, useRef } from "react";
import { AudioButton, AudioButtonRef } from "../AudioButton/AudioButton";

type Props = {
  question: Question;
  auxQuestion?: Question;
};

// TODO: define ref - auxaudio or main audio
// TODO: define autoplay rule
// TODO: aux video

export function Header({ question, auxQuestion }: Props) {
  const { getRule, hasAudioTitle, audioTitles } = useQuestionHelper(question);

  const shouldPlayAux = Boolean(getRule("auxAutoPlay")?.value);

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxRef = useRef<AudioButtonRef>(null);

  useEffect(() => {
    if (!auxQuestion) return;
    if (mainAudioRef.current && auxRef.current) {
      if (shouldPlayAux) {
        mainAudioRef.current.sound.onEnd(() => {
          auxRef.current?.sound.play();
        });
      }
    }
  }, [mainAudioRef, auxRef]);

  const audio = useMemo(() => {
    return audioTitles.map((a) => ({
      src: a.file_url!,
      autoPlay: true, // FIXME: use rule
      ref: a.position === 0 ? mainAudioRef : auxRef,
    }));
  }, [question, auxQuestion]);

  if (!hasAudioTitle) return null;

  return (
    <div className="flex gap-6 w-full">
      {audio.map((props, inx) => (
        <AudioButton
          key={inx}
          {...props}
        />
      ))}
      {auxQuestion && <ReadButton question={auxQuestion} />}
    </div>
  );
}
