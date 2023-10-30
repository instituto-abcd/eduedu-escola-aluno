import { Group, Image } from "@mantine/core";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import arrowLeft from "~/assets/planets/arrow-left-red.png";
import arrowRight from "~/assets/planets/arrow-right-green.png";
import { AudioButton } from "~/components/AudioButton";
import { CardStack } from "~/components/CardStack";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import feedbackNegative from "~/assets/audio/feedback_error.mp3";
import feedbackPositive from "~/assets/audio/feedback_button_next.mp3";

export function Model12({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const { audioTitles, imageTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);
  const [stack, setStack] = useState<QuestionOption[]>(question.options);

  const [, dropLeft] = useDrop({
    accept: "ANSWER_CARD",
    drop: (option: QuestionOption) => {
      setAnswers((state) => [...state, { ...option, positionAnswer: 1 }]);
      setStack(
        stack.filter((item) => JSON.stringify(item) !== JSON.stringify(option))
      );
      handleFeedback("left", option);
    },
  });

  const [, dropRight] = useDrop({
    accept: "ANSWER_CARD",
    drop: (option: QuestionOption) => {
      setAnswers((state) => [...state, { ...option, positionAnswer: 2 }]);
      setStack(
        stack.filter((item) => JSON.stringify(item) !== JSON.stringify(option))
      );
      handleFeedback("right", option);
    },
  });

  const negativeSound = useRef<HTMLAudioElement>(null);
  const positiveSound = useRef<HTMLAudioElement>(null);

  function handleFeedback(position: "left" | "right", option: QuestionOption) {
    if (position === "left" && option.isCorrect === false) {
      void positiveSound.current?.play();
    } else if (position === "right" && option.isCorrect === true) {
      void positiveSound.current?.play();
    } else {
      void negativeSound.current?.play();
    }
  }

  useEffect(() => {
    setAnswers([]);
    setStack(question.options);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers);
  }, [answers]);

  useEffect(() => {
    setContinueDisabled(answers.length < question.options.length);
  }, [question, answers]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={inx}
                src={title.file_url!}
                autoPlay={audioTitleAutoplay(inx)}
              />
            ))}
        </Group>
      )}

      {imageTitles[0] && (
        <Image
          src={imageTitles[0].file_url}
          height={boardW(170)}
          width="auto"
        />
      )}

      <Group position="apart" spacing={boardW(52)} align="center" my="auto">
        <DropYesOrNo direction="left" ref={dropLeft} />
        <CardStack
          options={stack}
          cardProps={{ variant: "wide", imageOnly: true }}
        />
        <DropYesOrNo direction="right" ref={dropRight} />
      </Group>

      <audio
        src={feedbackNegative}
        ref={negativeSound}
        style={{ display: "none" }}
      />
      <audio
        src={feedbackPositive}
        ref={positiveSound}
        style={{ display: "none" }}
      />
    </>
  );
}

const DropYesOrNo = forwardRef<HTMLDivElement, { direction: "left" | "right" }>(
  (props, ref) => {
    return (
      <div
        style={{
          width: boardW(170),
          height: boardW(198),
          backgroundColor: props.direction === "left" ? "#FFE3E3" : "#D3F9D8",
          display: "grid",
          placeItems: "center",
          borderRadius: 16,
        }}
        ref={ref}
      >
        <Image
          src={props.direction === "left" ? arrowLeft : arrowRight}
          width={boardW(50)}
          height="auto"
        />
      </div>
    );
  }
);
