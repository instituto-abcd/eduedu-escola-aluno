import {
  Group,
  LoadingOverlay,
  Stack,
  Title,
  createStyles,
} from "@mantine/core";
import { ModelProps } from ".";
import { CardStack } from "~/components/CardStack";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { produce } from "immer";
import { usePlanetAnswer } from "~/api/planet";
import { EduButton } from "~/components/EduButton";
import { lousaHeight } from "~/constants/dimensions";

const useStyles = createStyles({
  stack: {
    width: 400,
    height: 100,
  },
  stackCard: {
    fontSize: 4,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
});

export function Model31({ question, answerCallback }: ModelProps) {
  const { imageTitles, textTitles } = useQuestionHelper(question);
  const statement = textTitles[0]?.description ?? "MISSING_TITLE";
  const { classes } = useStyles();

  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);
  const disabled = answers.length < options.length;

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
  }, []);

  useEffect(() => {
    setOptions(question.options);
  }, [question]);

  return (
    <>
      <Title maw={533} color="dark.3" size={25} weight={500} align="center">
        {statement}
      </Title>
      <Group my="auto" spacing={60}>
        <Stack>
          {imageTitles
            .filter((title) => title.file_url)
            .map((imageTitle, inx) => (
              <Group key={inx}>
                <img src={imageTitle.file_url!} height={100} />
                <DraggableCardSlot<QuestionOption>
                  onDrop={(item) => item && handleDrop(item, inx)}
                  item={answers[inx] ?? null}
                  className={classes.stack}
                  replaceWith={
                    <DraggableCard
                      item={null}
                      text={answers[inx]?.description}
                      className={classes.stack}
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
          className={classes.stack}
          cardProps={{ textProps: { size: 20 } }}
        />
      </Group>

      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
