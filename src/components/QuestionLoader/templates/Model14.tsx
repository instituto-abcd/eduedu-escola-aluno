import { useEffect, useMemo, useRef, useState } from "react";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { AudioContainer } from "~/components/AudioContainer";
import { ImageTitle } from "~/components/question-components";
import { CardManual } from "~/components/question-components/card-manual";

export function Model14({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitleAutoplay, getRule } = useQuestionHelper(question);
  const circleRule = question.rules.find((rule) => rule.name === "circle_size");
  const circleSize = circleRule ? +circleRule.value : 4;
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const hasAux = !!question.options[0]?.sound_url;
  const auxAudioRef = useRef<AudioButtonRef>(null);
  const mainAudioRef = useRef<AudioButtonRef>(null);

  useEffect(() => {
    if (auxAudioRef.current) {
      const auxSound = auxAudioRef.current.sound;
      mainAudioRef.current?.sound.onEnd(() => {
        if (hasAux && auxSound && !auxSound.playing()) {
          auxSound.play();
        }
      });
    }

    return () => {
      auxAudioRef.current?.sound.destroy();
      mainAudioRef.current?.sound.off("end");
    };
  }, [question]);

  const handleOnClick = (index: number) => {
    setAnswer({
      position: index,
      positionAnswer: index,
    } as QuestionOption);
  };

  const shouldAuxAutoPlay =
    (!!mainAudioRef && !audioTitleAutoplay(0)) ||
    (!getRule("autoplay") && !mainAudioRef.current?.sound.playing);

  /* Map option to IMAGE title */
  const imgTitles = question.options.map((op) => ({
    file_url: op.image_url,
    description: op.description,
  })) as QuestionTitle[];

  return (
    <>
      <AudioContainer
        question={question}
        audioRef={mainAudioRef}
      >
        {hasAux && (
          <AudioButton
            ref={auxAudioRef}
            src={question.options[0].sound_url!}
            autoPlay={shouldAuxAutoPlay}
          />
        )}
      </AudioContainer>

      <div className="flex flex-col justify-evenly items-center size-full">
        <ImageTitle titles={imgTitles} />

        <div className="flex gap-2 w-full h-[120px] max-w-3xl">
          {Array(circleSize)
            .fill(null)
            .map((_, inx) => (
              <CardManual
                shape="contain"
                onClick={() => handleOnClick(inx)}
                text={(inx + 1).toString()}
                key={inx}
                selected={
                  typeof answer?.position === "number"
                    ? +answer.position >= inx
                    : false
                }
              />
            ))}
        </div>
      </div>
    </>
  );
}
