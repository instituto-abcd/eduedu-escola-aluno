import { Group, Image, LoadingOverlay } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import arrowLeft from "~/assets/planets/arrow-left-red.png";
import arrowRight from "~/assets/planets/arrow-right-green.png";
import { useDrop } from "react-dnd";
import { forwardRef, useEffect, useState } from "react";
import { CardStack } from "~/components/CardStack";
import { QuestionOption } from "~/api/exam";
import { EduButton } from "~/components/EduButton";
import { usePlanetAnswer } from "~/api/planet";
import { boardW, lousaHeight } from "~/constants/dimensions";

export function Model12({ question, answerCallback }: ModelProps) {
  const { audioTitles, imageTitles } = useQuestionHelper(question);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);
  const [stack, setStack] = useState<QuestionOption[]>(question.options);

  const [, dropLeft] = useDrop({
    accept: "ANSWER_CARD",
    drop: (option: QuestionOption) => {
      setAnswers((state) => [...state, { ...option, positionAnswer: 1 }]);
      setStack(
        stack.filter((item) => JSON.stringify(item) !== JSON.stringify(option))
      );
    },
  });

  const [, dropRight] = useDrop({
    accept: "ANSWER_CARD",
    drop: (option: QuestionOption) => {
      setAnswers((state) => [...state, { ...option, positionAnswer: 2 }]);
      setStack(
        stack.filter((item) => JSON.stringify(item) !== JSON.stringify(option))
      );
    },
  });

  const disabled = answers.length < question.options.length;

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (disabled) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: answers,
    });
  }

  useEffect(() => {
    setAnswers([]);
    setStack(question.options);
  }, [question]);

  return (
    <>
      {audioTitles.length > 0 &&
        audioTitles
          .filter((title) => title.file_url)
          .map((title) => (
            <AudioButton src={title.file_url!} key={title.file_url} />
          ))}

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

      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
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
