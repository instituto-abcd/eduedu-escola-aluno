import { useEffect, useMemo, useRef, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  DraggableCardSquare,
  DroppablePictureCardSquare,
  DraggablePictureCardSquare,
} from "~/components/dnd";
import { v4 as uuid } from "uuid";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";

type OptionWithSound = QuestionOption & {
  id: string;
  sound?: Howl;
};

type CleanQuestionOption = Omit<QuestionOption, "sound_url">;

export function Model34({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

  const {
    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    imageTitles,
    getRule,
  } = useQuestionHelper(question);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxRef = useRef<AudioButtonRef>(null);

  const auxAutoPlayRule = getRule("auxAutoPlay");
  const shouldPlayAux = auxAutoPlayRule?.value === "false" ? false : true;

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  function handleDrop(option: OptionWithSound | null) {
    if (!option) return;

    const { id, sound, ...cleanOption } = option;

    setAnswer({
      ...cleanOption,
      positionAnswer: 0,
    });
  }

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current) {
      const option: OptionWithSound = e.active.data.current.option;
      option.sound?.play();
      setActiveDrag(() => option);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveDrag(null);
    if (e.over && e.active.data.current) {
      const option = e.active.data.current.option as OptionWithSound;
      handleDrop(option);
    }
  }

  function handleClearAnswer() {
    setAnswer(null);
  }

  const optionsWithIds = useMemo(
    () =>
      question.options.map((option) => ({
        ...option,
        id: uuid(),
        sound: new Howl({
          src: [option.sound_url ?? ""],
          html5: true,
          format: ["mp3"],
          loop: false,
        }),
      })),
    [question]
  );

  useEffect(() => {
    if (mainAudioRef.current && auxRef.current && shouldPlayAux) {
      mainAudioRef.current.sound.onEnd(() => {
        auxRef.current?.sound.play();
      });
    }
  }, [mainAudioRef, auxRef]);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    if (answer) {
      const cleanAnswer: CleanQuestionOption = {
        id: answer.id,
        description: answer.description,
        image_url: answer.image_url,
        position: answer.position,
        is_correct: answer.is_correct,
      };
      onAnswerChange([cleanAnswer]);
    } else {
      onAnswerChange([]);
    }
  }, [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      {hasAudioTitle && (
        <div className="flex gap-4 lg:self-start">
          {audioTitles.map((title, inx) => (
            <AudioButton
              index={inx}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
              ref={inx === 1 ? auxRef : mainAudioRef}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col flex-1 w-full justify-around items-center">
        <div className="flex flex-col">
          <div className="flex flex-col items-center max-h-[40vh] md:max-h-[50vh] aspect-[2/3]">
            <div className="flex items-center w-full p-2 max-w-[350px] min-h-[125px] aspect-[2/3] rounded-[20px] md:rounded-[45px] border-2 border-[#4c494140]">
              <div>
                <img
                  className="w-full min-h-[125px] h-[200px] md:h-[250px] lg:h-[300px] object-scale-down"
                  src={imageTitles[0].file_url!}
                  alt="Question image"
                />
              </div>
            </div>

            <DroppablePictureCardSquare
              key="unique-drop-area"
              optionItem={answer}
              index={0}
              total={1}
              id={0}
              replaceWith={
                answer && (
                  <DraggablePictureCardSquare
                    id={+answer.position}
                    index={0}
                    total={1}
                    optionItem={answer}
                    image={answer.image_url}
                    sound={answer.sound_url}
                    onClear={handleClearAnswer}
                    disabled
                  />
                )
              }
            />
          </div>
        </div>

        <div className="flex justify-around items-center w-full md:w-3/4 h-1/2 max-h-[20vh]">
          {optionsWithIds.map((item, inx) =>
            answer?.position === item.position ? (
              <DraggableCardSquare
                id={Math.random() * 30}
                key={inx}
                optionItem={item}
                size={4}
                image={item.image_url}
                text={item.description}
                sound={item.sound_url}
                hidden
                debug={{ skipDebug: true }}
                disabled={mainAudioRef.current?.sound.playing()}
                className="lg:max-h-[125px]"
              />
            ) : (
              <DraggableCardSquare
                id={item.id}
                key={inx}
                optionItem={item}
                size={4}
                image={item.image_url}
                text={item.description}
                sound={item.sound_url}
                debug={{ debugProperty: "isCorrect" }}
                disabled={mainAudioRef.current?.sound.playing()}
                className="lg:max-h-[125px]"
              />
            )
          )}
        </div>

        <DragOverlay>
          {activeDrag && (
            <DraggableCardSquare
              id={32145}
              optionItem={activeDrag}
              size={3}
              image={activeDrag.image_url}
              text={activeDrag.description}
              sound={activeDrag.sound_url}
              debug={{ skipDebug: true }}
              disabled
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
