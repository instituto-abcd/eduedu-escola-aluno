import { Group, LoadingOverlay, Stack, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { CardStack } from "~/components/CardStack";
import { DraggableCardSlot } from "~/components/DraggableCard";
import { QuestionOption } from "~/api/exam";
import { useEffect, useState } from "react";
import { produce } from "immer";
import { usePlanetAnswer } from "~/api/planet";
import { EduButton } from "~/components/EduButton";
import { lousaHeight } from "~/constants/dimensions";

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

export function Model19({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles } = useQuestionHelper(question);
  const { classes } = useStyles();

  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);
  const slots = textTitles[0] ? textTitles[0].description.split(" ") : [];
  const disabled = options.length > 0;
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
    setOptions(question.options);
  }, []);

  return (
    <>
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles
          .filter((title) => title.file_url)
          .map((title, inx) => (
            <AudioButton
              src={title.file_url!}
              key={title.file_url}
              autoPlay={inx === 0}
            />
          ))}
      </Group>

      {/* Board content */}
      <Stack align="center" spacing={50} my="auto">
        <CardStack
          options={options}
          cardProps={{ variant: "square", imageOnly: !showOptionsDesc }}
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

      {/* Continue to the next screen button */}
      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
