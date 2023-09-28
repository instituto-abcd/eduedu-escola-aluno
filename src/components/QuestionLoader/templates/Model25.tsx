import { Group, LoadingOverlay, Stack, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useDrop } from "react-dnd";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { DraggableCard } from "~/components/DraggableCard";
import { useEffect, useState } from "react";
import { produce } from "immer";
import { usePlanetAnswer } from "~/api/planet";
import { EduButton } from "~/components/EduButton";
import { lousaHeight } from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  slot: {
    width: 240,
    height: 148,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[6],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  wideButton: {
    width: 240,
    height: 148,
    // TODO: mergear com estilo do componente raíz (não funcional)
    borderRadius: 16,
    backgroundColor: "#fff",
    boxShadow: "0 4px 0 0 #228BE6",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#228BE6",
    padding: 16,
    display: "grid",
    placeItems: "center",
    position: "relative",
  },
  text: {
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.gray[7],
    textAlign: "center",
  },
}));

export function Model25({ question }: ModelProps) {
  const { audioTitles, imageTitles } = useQuestionHelper(question);
  const { classes } = useStyles();

  const [answers, setAnswers] = useState<Array<QuestionOption | null>>([
    null,
    null,
    null,
  ]);

  function onDrop(option: QuestionOption | null, inx: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[inx] = option;
      })
    );
  }

  function hideTitle(position: number) {
    return answers.some((answer) => answer?.positionAnswer === position);
  }

  const { mutate, isLoading } = usePlanetAnswer();

  function submitAnswer() {
    if (answers.includes(null)) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: answers as QuestionOption[],
    });
  }

  useEffect(() => {
    setAnswers([null, null, null]);
  }, [question]);

  return (
    <>
      {/* Action buttons */}
      {audioTitles.filter((title) => title.file_url) && (
        <Group mx="auto">
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url!}
              key={title.file_url}
              autoPlay={inx === 0}
            />
          ))}
        </Group>
      )}

      {/* Board content */}
      <Stack my="auto">
        <Group>
          {question.options.map((option, inx) => (
            <SlotCard
              key={inx}
              option={option}
              onDrop={(title) =>
                title
                  ? onDrop({ ...option, positionAnswer: title.position }, inx)
                  : onDrop(null, inx)
              }
            />
          ))}
        </Group>
        <Group>
          {imageTitles.map((title, inx) =>
            !title.file_url && title.description ? (
              <DraggableCard<QuestionTitle>
                key={inx}
                className={classes.wideButton}
                item={title}
                hidden={hideTitle(title.position)}
                text={title.description}
                textClasses={classes.text}
              />
            ) : (
              <DraggableCard<QuestionTitle>
                key={inx}
                className={classes.wideButton}
                item={title}
                image={title.file_url}
                hidden={hideTitle(title.position)}
              />
            )
          )}
        </Group>
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={answers.includes(null)}
        onClick={submitAnswer}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}

function SlotCard({
  option,
  onDrop,
}: {
  option: QuestionOption;
  onDrop: (item: QuestionTitle | null) => void;
}) {
  const [droppedTitle, setDropppedTitle] = useState<QuestionTitle | null>(null);
  const [, drop] = useDrop(
    () => ({
      accept: "ANSWER_CARD",
      drop: (item: QuestionTitle | null) => {
        onDrop(item);
        setDropppedTitle(item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  useEffect(() => {
    setDropppedTitle(null);
  }, [option]);

  const { classes } = useStyles();

  if (droppedTitle) {
    return (
      <DraggableCard
        disabled
        className={classes.wideButton}
        textClasses={classes.text}
        item={droppedTitle}
        image={droppedTitle.file_url}
        text={droppedTitle.description}
        onClear={() => {
          setDropppedTitle(null), onDrop(null);
        }}
      />
    );
  }

  return (
    <div className={classes.slot} ref={drop}>
      <img
        src={option.image_url ?? ""}
        alt={option.description}
        width={100}
        style={{
          maxHeight: 130,
          objectFit: "contain",
          marginInline: "auto",
        }}
      />
    </div>
  );
}
