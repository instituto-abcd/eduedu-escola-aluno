import { SimpleGrid } from "@mantine/core";
import { ModelProps } from ".";
import { DraggableCardSlot, DraggableCard } from "~/components/DraggableCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { QuestionOption } from "~/api/exam";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { AuxiliaryVideoModal } from "~/components/AuxiliaryVideoModal";
import { PictureDndSlot } from "~/components/question-components";
import { PictureDndCard } from "~/components/question-components";

export function Model2({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const handleDrop = useCallback(function (
    item: QuestionOption | null,
    index: number
  ) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item ? { ...item, positionAnswer: index } : item;
      })
    );
  }, []);

  const {
    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    textTitles,
    getRule,
    videoTitles,
  } = useQuestionHelper(question);

  /* Autoplay Aux Audio Logic */
  const auxAutoPlayRule = getRule("auxAutoPlay");
  const shouldPlayAux = auxAutoPlayRule?.value === "false" ? false : true;
  const noPaddingRule = getRule("noPadding")?.value === "true";

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxRef = useRef<AudioButtonRef>(null);

  useEffect(() => {
    if (mainAudioRef.current && auxRef.current) {
      if (shouldPlayAux) {
        mainAudioRef.current.sound.onEnd(() => {
          auxRef.current?.sound.play();
        });
      }
    }
  }, [mainAudioRef, auxRef]);
  /* End Aux Logic */

  useEffect(() => {
    setAnswers(question.options.map(() => null));
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers.filter((answer) => answer !== null));
  }, [answers]);

  const conditions = useMemo(
    () => [answers.every((answer) => answer !== null)],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const auxVideo = videoTitles.find(
    (title) => title.description && title.description.includes("Botão")
  );

  const cardSize =
    question.options.length > 3 ? question.options.length : undefined;

  return (
    <>
      {hasAudioTitle && (
        <div className="flex gap-4 lg:self-start">
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
              ref={inx === 1 ? auxRef : mainAudioRef}
            />
          ))}
          {auxVideo && (
            <AuxiliaryVideoModal videoUrl={auxVideo.file_url ?? ""} />
          )}
        </div>
      )}

      <div className="my-auto flex flex-col items-center w-full gap-4 md:gap-9 max-h-[80vh]">
        {textTitles.map((title) => (
          <p
            key={title.description}
            className="text-center text-zinc-600 text-2xl font-medium"
          >
            {title.description}
          </p>
        ))}

        {!noPaddingRule && (
          <SimpleGrid
            cols={question.options.length}
            className="xl:place-items-center grid xl:h-[40vh] xl:w-auto"
          >
            {answers.map((slot, inx) => (
              <DraggableCardSlot
                key={inx}
                onDrop={(item) => handleDrop(item, inx)}
                item={slot}
                size={cardSize}
                replaceWith={
                  <DraggableCard
                    item={slot}
                    image={slot?.image_url}
                    text={slot?.description}
                    sound={slot?.sound_url}
                    disabled
                    onClear={() => handleDrop(null, inx)}
                    debug={{ skipDebug: true }}
                  />
                }
              />
            ))}
          </SimpleGrid>
        )}

        {noPaddingRule && (
          <SimpleGrid
            cols={question.options.length}
            className="place-items-center grid gap-0 md:gap-0 justify-center xl:h-[40vh] xl:w-auto"
          >
            {answers.map((slot, inx) => (
              <PictureDndSlot
                key={inx}
                onDrop={(item) => handleDrop(item, inx)}
                item={slot}
                index={inx}
                total={question.options.length}
                replaceWith={
                  <PictureDndCard
                    item={slot}
                    image={slot?.image_url ?? ""}
                    sound={slot?.sound_url}
                    disabled
                    onClear={() => handleDrop(null, inx)}
                    debug={{ skipDebug: true }}
                  />
                }
              />
            ))}
          </SimpleGrid>
        )}
        <SimpleGrid
          cols={question.options.length}
          className="gap-4 xl:h-[40vh] xl:w-auto"
        >
          {question.options.map((item) => (
            <DraggableCard
              item={item}
              key={item.position}
              size={cardSize}
              image={item.image_url}
              text={item.description}
              sound={item.sound_url}
              hidden={
                !!answers.find((slot) => slot?.position === item.position)
              }
              debug={{ debugProperty: "position" }}
            />
          ))}
        </SimpleGrid>
      </div>
    </>
  );
}
