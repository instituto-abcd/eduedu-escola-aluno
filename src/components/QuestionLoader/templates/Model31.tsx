import { Group, Stack, Title, createStyles } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { CardStack } from "~/components/CardStack";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  slot: {
    width: boardW(500),
    height: boardW(90),
  },
  stackAnswers: {
    width: `${boardW(500)}px!important`,
    height: `auto !important`,
  },
  stackOptions: {
    width: `${boardW(500)}px!important`,
    height: `${boardW(70)}px!important`,
  },
  text: {
    fontSize: boardW(20),
    textAlign: "center",
  },
});

export function Model31({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { imageTitles, textTitles } = useQuestionHelper(question);
  const statement = textTitles[0]?.description ?? "MISSING_TITLE";
  const { classes } = useStyles();

  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);

  function handleDrop(item: QuestionOption | null, index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        item
          ? (draft[index] = { ...item, positionAnswer: index })
          : (draft = draft.filter((_, inx) => inx !== index));
      })
    );

    setOptions((state) =>
      state.filter((opt) => JSON.stringify(opt) !== JSON.stringify(item))
    );
  }

  function handleClear(index: number) {
    setOptions((state) => [answers[index], ...state]);
    setAnswers((state) => state.filter((_, inx) => inx !== index));
  }

  useEffect(() => {
    setAnswers([]);
  }, [statement, question]);

  useEffect(() => {
    setOptions(question.options);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers);
  }, [answers]);

  const conditions = useMemo(
    () => [answers.length === question.options.length],
    [answers, question]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      <Stack
        w="100%"
        my="auto"
        pt={boardW(20)}
        align="center"
        spacing={boardW(1)}
      >
        <Title color="dark.3" size={boardW(24)} weight={500} align="center">
          {statement}
        </Title>
        <Stack spacing={0}>
          {imageTitles
            .filter((title) => title.file_url)
            .map((imageTitle, inx) => (
              <Group key={inx}>
                <img src={imageTitle.file_url!} height={100} />
                <DraggableCardSlot<QuestionOption>
                  onDrop={(item) => item && handleDrop(item, inx)}
                  item={answers[inx] ?? null}
                  className={classes.slot}
                  replaceWith={
                    <DraggableCard
                      item={null}
                      text={answers[inx]?.description}
                      className={classes.stackAnswers}
                      disabled
                      onClear={() => handleClear(inx)}
                      textClasses={classes.text}
                    />
                  }
                />
              </Group>
            ))}
        </Stack>

        <CardStack
          options={options}
          className={classes.stackOptions}
          cardProps={{
            textProps: { size: boardW(20) },
            debug: { skipDebug: true },
          }}
        />
      </Stack>
    </>
  );
}
