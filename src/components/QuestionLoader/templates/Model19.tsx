import { Group, Stack, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { CardStack } from "~/components/CardStack";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { QuestionOption } from "~/api/exam";
import { useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import { ReadButton } from "~/components/ReadButton";

const useStyles = createStyles({
  slot: {
    width: 95,
    height: 95,
    color: "#495057",
    fontSize: 50,
    fontWeight: 600,
    display: "grid",
    placeItems: "center",
  },
});

export function Model19({
  question,
  onAnswerChange,
  onConditionsChange,
  setContinueDisabled,
  auxQuestion,
}: ModelProps) {
  const { classes } = useStyles();

  const { audioTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);

  const [options, setOptions] = useState<QuestionOption[]>(question.options);

  const descRule = question.rules.find((rule) => rule.name === "show_option_desc");
  const showOptionsDesc = Boolean(
    descRule === undefined ? true : descRule.value === "false" ? false : true
  );

  const targetLettersRule = question.rules.find((rule) => rule.name === "show_targets_letters");
  const showTargetLetters = Boolean(
    targetLettersRule === undefined ? true : targetLettersRule.value === "false" ? false : true
  );

  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  function handleDrop(item: QuestionOption | null, index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );
    setOptions((state) =>
      state.filter((opt) => JSON.stringify(opt) !== JSON.stringify(item))
    );
  }

  function handleClear(item: QuestionOption | null, index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = null;
      })
    );

    setOptions((state) =>
      produce(state, (draft) => {
        // Add the cleared item back to the options array
        if (item) {
          draft.push(item);
        }
      })
    );
  }

  useEffect(() => {
    onAnswerChange(answers.filter((ans) => ans !== null) as QuestionOption[]);
  }, [answers]);

  const conditions = useMemo(
    () => [answers.every((ans) => ans !== null)],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
    setContinueDisabled(answers.length);
  }, [conditions]);


  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url!}
              key={title.file_url}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </Group>
      )}

      <Stack align="center" spacing={50} my="auto">
        <CardStack
          options={options}
          cardProps={{
            variant: "square",
            imageOnly: !showOptionsDesc,
            debug: {
              debugProperty: "position",
            },
          }}
        />

        <Group>
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
                  text={showTargetLetters ?? answers[inx]?.description}
                  disabled
                  onClear={() => handleClear(answer, inx)}
                />
              }
            >
            </DraggableCardSlot>
          ))}
        </Group>
      </Stack>
    </>
  );
}
