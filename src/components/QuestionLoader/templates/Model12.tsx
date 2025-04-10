import { Image } from "@mantine/core";
import { useEffect, useMemo, useState, useRef } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioInterface } from "~/sounds";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { v4 as uuid } from "uuid";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import {
  DraggablePictureCardBasic,
  DroppablePictureCardBasic,
} from "~/components/dnd";

type OptionWithSound = QuestionOption & {
  id: string;
  sound?: Howl;
};

export function Model12({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles, imageTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);
  const [stack, setStack] = useState<OptionWithSound[]>([]);
  const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const mainAudioRef = useRef<AudioButtonRef>(null);

  function handleDrop(
    option: OptionWithSound | null,
    overId: UniqueIdentifier
  ) {
    if (!option) return;

    const { id, sound, ...cleanOption } = option;

    setAnswers((state) => [
      ...state,
      {
        ...cleanOption,
        positionAnswer: overId === "left" ? 1 : 2,
      },
    ]);
    setStack(
      stack.filter((item) => {
        const { id, sound, ...cleanItem } = item;

        return JSON.stringify(cleanItem) !== JSON.stringify(cleanOption);
      })
    );
    handleFeedback(overId, option);
  }

  function onDragStart(e: DragStartEvent) {
    if (e.active.data.current) {
      const option: OptionWithSound = e.active.data.current.option;
      option.sound?.play();
      setActiveDrag(() => option);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    if (e.over && e.active.data.current) {
      const option = e.active.data.current.option as OptionWithSound;
      handleDrop(option, e.over.id);
      setActiveDrag(null);
    }
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

  function handleFeedback(position: UniqueIdentifier, option: QuestionOption) {
    if (position === "left" && option.isCorrect === false) {
      AudioInterface.feedback.positive.play();
    } else if (position === "right" && option.isCorrect === true) {
      AudioInterface.feedback.positive.play();
    } else {
      AudioInterface.feedback.negative.play();
    }
  }

  useEffect(() => {
    setAnswers([]);
    setStack(optionsWithIds);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers);
  }, [answers]);

  const conditions = useMemo(() => [stack.length === 0], [stack]);

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
              ref={mainAudioRef}
            />
          ))}
        </div>
      )}
      <div className="flex flex-1 w-full flex-col justify-evenly items-center">
        <div className="w-full max-w-[270px] flex md:hidden max-h-[270px] h-[60%] justify-evenly items-center">
          {imageTitles[0] && (
            <Image
              src={imageTitles[0].file_url}
              width="auto"
              className="min-w-full"
            />
          )}
        </div>
        <div className="flex w-full h-[40%] md:h-[60%] lg:h-[90%] items-center justify-between lg:justify-evenly">
          <DroppablePictureCardBasic
            id={"left"}
            key="left-drop-area"
            optionItem={stack[0]}
            className="flex items-center text-red-600 justify-center mr-4 w-1/2 lg:w-1/4 rounded-r-[45px] lg:rounded-[45px] h-full bg-[#4c494120]"
          >
            <IconX size={"50%"} />
          </DroppablePictureCardBasic>
          <div className="flex flex-col w-3/4 md:w-full lg:w-1/3 h-full justify-evenly items-center">
            <div className="w-full max-w-[270px] hidden md:flex max-h-[270px] h-[60%] justify-evenly items-center">
              {imageTitles[0] && (
                <Image
                  src={imageTitles[0].file_url}
                  width="auto"
                  className="hidden md:inline min-w-full"
                />
              )}
            </div>
            <div className="w-full lg:w-[80%] flex items-center justify-center">
              {stack[0] && (
                <DraggablePictureCardBasic
                  id={stack[0].id}
                  key={stack[0].id}
                  optionItem={stack[0]}
                  image={stack[0].image_url}
                  sound={stack[0].sound_url}
                  disabled={mainAudioRef.current?.sound.playing()}
                />
              )}
            </div>
          </div>
          <DroppablePictureCardBasic
            id={"right"}
            key="right-drop-area"
            optionItem={stack[0]}
            className="flex items-center text-green-600 justify-center ml-4 w-1/2 lg:w-1/4 rounded-l-[45px] lg:rounded-[45px] h-full bg-[#4c494120]"
          >
            <IconCheck size={"50%"} />
          </DroppablePictureCardBasic>
        </div>

        <DragOverlay>
          {activeDrag && (
            <DraggablePictureCardBasic
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
