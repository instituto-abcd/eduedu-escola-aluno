import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
  Group,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";
import { QuestionOption } from "~/api/exam";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { useEffect, useState } from "react";
import { produce } from "immer";
import { EduButton } from "~/components/EduButton";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight } from "~/constants/dimensions";

const useStyles = createStyles({
  slot: {
    width: 128,
    height: 133,
    display: "grid",
    placeItems: "center",
  },
  card: {
    width: 128,
    height: 133,
    img: {
      maxWidth: "85% !important",
    },
  },
  text: {
    fontSize: 20,
    color: "#495057",
  },
});

export function Model29({ question, answerCallback }: ModelProps) {
  const { textTitles } = useQuestionHelper(question);
  const { classes } = useStyles();

  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const disabled = answers.some((ans) => ans === null);

  function handleDrop(item: QuestionOption | null, index: number) {
    if (item === null) return;

    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );
  }

  function handleClear(index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = null;
      })
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
      optionsAnswered: answers.map((ans, inx) => ({
        ...ans,
        positionAnswer: inx,
      })) as QuestionOption[],
    });
  }

  useEffect(() => {
    setAnswers(question.options.map(() => null));
  }, [question]);

  return (
    <>
      <Stack my="auto">
        {textTitles[0]?.description && (
          <ScrollArea h={225}>
            <Text
              color="dark.3"
              dangerouslySetInnerHTML={{ __html: textTitles[0].description }}
              size={20}
            />
          </ScrollArea>
        )}
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
                  text={answers[inx]?.description}
                  textClasses={classes.text}
                  className={classes.card}
                  disabled
                  onClear={() => handleClear(inx)}
                />
              }
            >
              <Text size={40} weight={700} color="dark.3">
                {inx + 1}
              </Text>
            </DraggableCardSlot>
          ))}
        </Group>
        <Group>
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

      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
