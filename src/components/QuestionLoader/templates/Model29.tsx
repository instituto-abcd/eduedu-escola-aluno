import { Group, ScrollArea, Stack, Text, createStyles } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useMemo, useState, useCallback } from "react";
import { QuestionOption } from "~/api/exam";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  slot: {
    width: boardW(140),
    height: boardW(160),
    display: "grid",
    placeItems: "center",
  },
  card: {
    width: boardW(160),
    height: boardW(120),
    img: {
      marginBottom: "2px",
      width: boardW(70),
    },
  },
  text: {
    fontSize: boardW(20),
    color: "#495057",
  },
});

export function Model29({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { textTitles } = useQuestionHelper(question);
  const { classes } = useStyles();

  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const handleDrop = useCallback(function (item: QuestionOption | null, index: number) {
    if (item === null) return;
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );
  }, []);

  function handleClear(index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = null;
      })
    );
  }

  useEffect(() => {
    onAnswerChange(answers.filter((ans) => ans !== null).map((item, index) => ({
      ...item, positionAnswer: index
    })) as QuestionOption[]);
  }, [answers]);

  const conditions = useMemo(
    () => [answers.every((ans) => ans !== null)],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      <Stack my="auto" w={boardW(800)}>
        {textTitles[0]?.description && (
          <ScrollArea h={boardW(200)} type="always">
            <Text
              color="dark.3"
              dangerouslySetInnerHTML={{ __html: textTitles[0].description }}
              size={boardW(18)}
            />
          </ScrollArea>
        )}
        <Group mx="auto">
          {answers.map((answer, inx) => (
            <DraggableCardSlot
              item={answer}
              key={inx}
              onDrop={(item) => handleDrop(item, inx)}
              className={classes.slot}
              replaceWith={
                <DraggableCard
                  item={null}
                  key={inx}
                  image={answers[inx]?.image_url}
                  text={answers[inx]?.description}
                  textClasses={classes.text}
                  className={classes.card}
                  disabled
                  onClear={() => handleClear(inx)}
                />
              }
            >
              <Text size={boardW(60)} weight={700} color="dark.3">
                {inx + 1}
              </Text>
            </DraggableCardSlot>
          ))}
        </Group>
        <Group mx="auto">
          {question.options.map((option, inx) => (
            <DraggableCard
              item={option}
              key={inx}
              image={option.image_url}
              text={option.description}
              textClasses={classes.text}
              className={classes.card}
              hidden={
                !!answers.find(
                  (opt) => JSON.stringify(opt) === JSON.stringify(option)
                )
              }
            />
          ))}
        </Group>
      </Stack>
    </>
  );
}
