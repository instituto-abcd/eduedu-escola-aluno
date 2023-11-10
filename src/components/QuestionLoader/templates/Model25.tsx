import { Group, Stack, createStyles } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableCard } from "~/components/DraggableCard";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { boardW } from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  slot: {
    width: boardW(240),
    height: boardW(148),
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
    width: boardW(240),
    height: boardW(148),
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
    fontSize: "1.1rem",
    fontWeight: 400,
    color: theme.colors.gray[7],
    textAlign: "center",
  },
}));

export function Model25({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
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

  function hideOption(option: QuestionOption) {
    return !!answers.find((op) => op?.positionAnswer === option.position);
  }

  useEffect(() => {
    setAnswers([null, null, null]);
  }, [question]);

  useEffect(() => {
    onAnswerChange(
      answers.filter((answer) => answer !== null) as QuestionOption[]
    );
  }, [answers]);

  useEffect(() => {
    setContinueDisabled(answers.includes(null));
  }, [answers]);

  return (
    <>
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

      <Stack my="auto">
        <Group>
          {imageTitles.map((title, inx) => (
            <SlotCard
              key={inx}
              title={title}
              onDrop={(option) =>
                title
                  ? onDrop(
                      {
                        ...(option as QuestionOption),
                        positionAnswer: inx,
                      },
                      inx
                    )
                  : onDrop(null, inx)
              }
            />
          ))}
        </Group>
        <Group>
          {question.options.map((option, inx) =>
            !option.image_name && option.description ? (
              <DraggableCard<QuestionOption>
                key={inx}
                className={classes.wideButton}
                item={option}
                hidden={hideOption(option)}
                text={option.description}
                textClasses={classes.text}
              />
            ) : (
              <DraggableCard<QuestionOption>
                key={inx}
                className={classes.wideButton}
                item={option}
                image={option.image_url}
                hidden={hideOption(option)}
              />
            )
          )}
        </Group>
      </Stack>
    </>
  );
}

function SlotCard({
  title,
  onDrop,
}: {
  title: QuestionTitle;
  onDrop: (item: QuestionOption | null) => void;
}) {
  const [droppedOption, setDroppedOption] = useState<QuestionOption | null>(
    null
  );

  const [, drop] = useDrop(
    () => ({
      accept: "ANSWER_CARD",
      drop: (item: QuestionOption | null) => {
        onDrop(item);
        setDroppedOption(item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  useEffect(() => {
    setDroppedOption(null);
  }, [title]);

  const { classes } = useStyles();

  if (droppedOption) {
    return (
      <DraggableCard
        disabled
        className={classes.wideButton}
        textClasses={classes.text}
        item={droppedOption}
        image={droppedOption.image_url}
        text={droppedOption.description}
        onClear={() => {
          setDroppedOption(null), onDrop(null);
        }}
      />
    );
  }

  return (
    <div className={classes.slot} ref={drop}>
      <img
        src={title.file_url ?? ""}
        alt={title.description}
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
