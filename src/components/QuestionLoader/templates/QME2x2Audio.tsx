import { IconVolume } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import {
  AudioControlRef,
  AudioControls,
} from "~/components/AudioControls/AudioControls";
import { OptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useCreateSound } from "~/hooks/useCreateSound";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";

export function QME2x2Audio({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  function getAudioTitle(classification: QuestionTitleClassification) {
    return audioTitles.find((t) => t.classification === classification);
  }

  /* Audio do enunciado */
  const enunciadoTitle = useMemo(
    () => getAudioTitle(QuestionTitleClassification.ENUNCIADO),
    [question]
  );
  const enunciado = useRef<AudioButtonRef>(null);

  /* Audio da estória */
  const storyTitle = useMemo(
    () => getAudioTitle(QuestionTitleClassification.HISTORIA),
    [question]
  );

  const story = useRef<AudioControlRef>(null);
  story.current?.sound.onEnd(() => {
    if (
      enunciadoTitle?.autoplay &&
      enunciado.current?.sound.playing() === false
    ) {
      enunciado.current?.sound.play();
    }
  });

  /* Audio de introdução */
  const introTitle = useMemo(
    () => getAudioTitle(QuestionTitleClassification.INTRO),
    [question]
  );
  const intro = useCreateSound({
    src: introTitle?.file_url ?? "",
    autoPlay: introTitle?.autoplay ?? false,
  });

  intro.sound.onEnd(() => {
    const isPlayingStory = story.current?.sound.playing();
    if (storyTitle?.autoplay === true && isPlayingStory === false) {
      story.current?.sound.play();
    } else if (
      storyTitle?.autoplay === false &&
      enunciadoTitle?.autoplay === true &&
      enunciado.current?.sound.playing() === false
    ) {
      enunciado.current?.sound.play();
    }
  });

  function init() {
    if (introTitle?.autoplay && intro) {
      if (intro.sound.playing()) return;

      intro.sound.play();
    }
  }

  useEffect(() => {
    setAnswer(null);
    init();
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const cols = question.options.length < 6 ? question.options.length / 2 : 3;

  return (
    <>
      {audioTitles
        .filter(
          (title) =>
            title.classification === QuestionTitleClassification.HISTORIA
        )
        .map((title) => (
          <AudioControls
            src={title.file_url ?? ""}
            key={title.file_url}
            ref={story}
          />
        ))}

      <div className="flex flex-wrap gap-2 mb-4">
        {audioTitles
          .filter(
            (title) =>
              title.classification === QuestionTitleClassification.ENUNCIADO
          )
          .map((title, inx) => (
            <AudioButton
              index={inx}
              src={title.file_url ?? ""}
              key={title.file_url}
              ref={enunciado}
            />
          ))}
      </div>

      <div
        className={`grid gap-4 my-auto`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          minWidth: "30%",
        }}
      >
        {question.options.map((option, inx) => {
          const hasLabel =
            option.description !== null && option.description.length > 2;
          return (
            <OptionButton
              key={inx}
              option={option}
              onClick={() => setAnswer(option)}
              data-selected={answer?.position === option.position}
            >
              <div className="flex flex-col justify-evenly items-center">
                {!hasLabel && <IconVolume size={boardW(70)} />}
                <p
                  className="break-words"
                  style={{
                    fontSize: hasLabel ? boardW(20) : boardW(30),
                    fontWeight: hasLabel ? 400 : 600,
                  }}
                >
                  {hasLabel ? option.description : inx + 1}
                </p>
              </div>
            </OptionButton>
          );
        })}
      </div>
    </>
  );
}
