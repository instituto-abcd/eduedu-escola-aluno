import { Group, Stack, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { CardStack } from "~/components/CardStack";
import { DraggableCardSlot } from "~/components/DraggableCard";
import { QuestionOption } from "~/api/exam";
import { useEffect, useState } from "react";
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
  setContinueDisabled,
  auxQuestion,
}: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay, textTitles } =
    useQuestionHelper(question);
  const { classes } = useStyles();

  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);
  const slots = textTitles[0]
    ? textTitles[0].description.trim().split(" ")
    : [];

  const descRule = question.rules.find(
    (rule) => rule.name === "show_option_desc"
  );
  const showOptionsDesc = Boolean(
    descRule === undefined ? true : descRule.value === "false" ? false : true
  );

  function handleDrop(item: QuestionOption, index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft.push({ ...item, positionAnswer: index } as QuestionOption);
      })
    );

    setOptions((state) =>
      state.filter((opt) => JSON.stringify(opt) !== JSON.stringify(item))
    );
  }

  useEffect(() => {
    setAnswers([]);
    setOptions(question.options);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers);
    setContinueDisabled(answers.length !== slots.length);
  }, [answers]);

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
          {slots.map((slot, inx) => (
            <DraggableCardSlot<QuestionOption>
              onDrop={(item) => item && handleDrop(item, inx)}
              item={null}
              key={inx}
              className={classes.slot}
            >
              {slot}
            </DraggableCardSlot>
          ))}
        </Group>
      </Stack>
    </>
  );
}
