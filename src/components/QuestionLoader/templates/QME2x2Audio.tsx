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
  const [isLocked, setIsLocked] = useState(true);
  const [isAuxLocked, setIsAuxLocked] = useState(true);
  const [isFirstModelQuestion, setIsFirstModelQuestion] = useState(false);

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

  /* Audio de introdução */
  const introTitle = useMemo(
    () => getAudioTitle(QuestionTitleClassification.INTRO),
    [question]
  );
  const intro = useCreateSound({
    src: introTitle?.file_url ?? "",
    autoPlay: introTitle?.autoplay ?? false,
  });

  useEffect(() => {
    const storySound = story.current?.sound;
    const enunciadoSound = enunciado.current?.sound;

    const onStoryEnd = () => {
      if (enunciadoTitle?.autoplay && enunciadoSound?.playing() === false) {
        enunciadoSound?.play();
      }
    };

    storySound?.onEnd(onStoryEnd);

    return () => {
      storySound?.off("end", onStoryEnd);
    };
  }, [question]);

  useEffect(() => {
    const introSound = intro.sound;
    const storySound = story.current?.sound;
    const enunciadoSound = enunciado.current?.sound;

    const onIntroEnd = () => {
      const isPlayingStory = storySound?.playing();
      if (storyTitle?.autoplay === true && isPlayingStory === false) {
        storySound?.play();
      } else if (
        storyTitle?.autoplay === false &&
        enunciadoTitle?.autoplay === true &&
        enunciadoSound?.playing() === false
      ) {
        enunciadoSound?.play();
      }
      setIsLocked(false);
    };

    introSound.onEnd(onIntroEnd);

    return () => {
      introSound.off("end", onIntroEnd);
    };
  }, [intro.sound, storyTitle?.autoplay, enunciadoTitle?.autoplay]);

  useEffect(() => {
    setAnswer(null);
    setIsLocked(true);
    setIsAuxLocked(true);
    // ATENÇÂO: Verifica se é a primeira questão do modelo para bloquear os controles de áudio da história apenas na primeira questão (ZIZI/VINICIUS DE MORAES)
    if ([65, 69].includes(question.id)) {
      setIsFirstModelQuestion(true);
    } else {
      setIsFirstModelQuestion(false);
    }
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    const s = enunciado.current?.sound;
    if (!s) return;

    const handler = () => setIsAuxLocked(false);
    s.onEnd(handler);

    return () => {
      s.off("end", handler);
    };
  }, [question]);

  const cols = question.options.length < 6 ? question.options.length / 2 : 3;

  return (
    <div className="flex flex-col w-full h-full items-center justify-evenly">
      <div className="flex flex-col w-full md:w-3/4 lg:w-2/3 items-center justify-center">
        {audioTitles
          .filter(
            (title) =>
              title.classification === QuestionTitleClassification.HISTORIA
          )
          .map((title) => (
            <AudioControls
              disabled={isFirstModelQuestion && (isLocked || isAuxLocked)}
              src={title.file_url ?? ""}
              key={title.file_url}
              ref={story}
              className="w-full"
              iconClassName="w-[40px] h-[40px]"
              iconWidth={30}
              iconHeight={30}
            />
          ))}

        <div className="flex flex-wrap gap-2 mb-6 mt-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, inx) => {
          const hasLabel =
            option.description !== null && option.description.length > 2;
          return (
            <div
              className="flex items-center justify-center xl:w-[220px] xl:h-[220px] md:w-[180px] md:h-[180px] w-[150px] h-[150px]"
              key={inx}
            >
              <OptionButton
                option={option}
                onClick={() => setAnswer(option)}
                data-selected={answer?.position === option.position}
                className="w-full h-full p-4"
              >
                <div className="flex flex-col justify-evenly items-center">
                  {!hasLabel && <IconVolume size={boardW(70)} />}
                  <p className="break-words xl:text-2xl md:text-xl text-md ">
                    {hasLabel ? option.description : inx + 1}
                  </p>
                </div>
              </OptionButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
