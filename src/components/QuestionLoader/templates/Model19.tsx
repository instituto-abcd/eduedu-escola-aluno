import { Group, Stack, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { CardStack } from "~/components/CardStack";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { QuestionOption } from "~/api/exam";
import { useCallback, useEffect, useMemo, useState } from "react";
import { produce } from "immer";
import { ReadButton } from "~/components/ReadButton";

const useStyles = createStyles({
  slot: {
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
  auxQuestion,
}: ModelProps) {
  const { classes } = useStyles();

  const { audioTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);

  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [targetLettersTitles, setTargetLettersTitles] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>([]);

  const showOptionsDesc = !question.rules.find((rule) => rule.name === "show_option_desc")?.value === "false";
  const showTargetLetters = !question.rules.find((rule) => rule.name === "show_targets_letters")?.value === "false";

  const lettersTitle = question.titles.find((title) => title.type === "TEXT");

  useEffect(() => {
    if (lettersTitle) {
      setTargetLettersTitles(lettersTitle.description.split(" "));
    }
  }, [lettersTitle]);

  useEffect(() => {
    setOptions(question.options);
    setAnswers(question.options.map(() => null));
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers.filter((ans) => ans !== null) as QuestionOption[]);
  }, [answers]);

  const conditions = useMemo(() => [answers.every((ans) => ans !== null)], [answers]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const handleDrop = useCallback((item: QuestionOption | null, index: number) => {
    setAnswers((prevAnswers) =>
      produce(prevAnswers, (draft) => {
        if (draft[index] === null && !draft.some((ans) => ans?.image_id === item?.image_id)) {
          draft[index] = item;
        }
      })
    );

    setOptions((prevOptions) =>
      produce(prevOptions, (draft) => {
        if (item) {
          const itemIndex = draft.findIndex((opt) => opt.image_id === item.image_id);
          if (itemIndex !== -1) {
            draft.splice(itemIndex, 1);
          }
        }
      })
    );
  }, []);

  const handleClear = useCallback((item: QuestionOption | null, index: number) => {
    setAnswers((prevAnswers) =>
      produce(prevAnswers, (draft) => {
        draft[index] = null;
      })
    );

    setOptions((prevOptions) =>
      produce(prevOptions, (draft) => {
        if (item && !draft.some((opt) => opt.image_id === item.image_id)) {
          draft.push(item);
        }
      })
    );
  }, []);



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
              showTargetLetters={showTargetLetters}
              replaceWith={
                <DraggableCard
                  item={null}
                  key={inx}
                  image={answers[inx]?.image_url}
                  text={
                    showTargetLetters
                      ? targetLettersTitles[inx]
                      : answers[inx]
                        ? answers[inx]?.description
                        : null
                  }
                  disabled
                  onClear={() => handleClear(answer, inx)}
                />
              }
            ></DraggableCardSlot>
          ))}
        </Group>
      </Stack>
    </>
  );
}
