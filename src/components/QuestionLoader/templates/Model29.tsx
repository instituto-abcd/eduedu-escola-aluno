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
import { boardW, lousaHeight } from "~/constants/dimensions";

const useStyles = createStyles({
  slot: {
    width: boardW(120),
    height: boardW(120),
    display: "grid",
    placeItems: "center",
  },
  card: {
    width: boardW(120),
    height: boardW(120),
    img: {
      marginBottom: '2px',
      width: boardW(100),
    },
  },
  text: {
    fontSize: boardW(20),
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
      {/* Board content */}
      <Stack my="auto" w={boardW(800)}>
        {textTitles[0]?.description && (
          <ScrollArea h={boardW(230)} type="always">
            <Text
              color="dark.3"
              dangerouslySetInnerHTML={{ __html: textTitles[0].description }}
              size={boardW(22)}
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
              <Text size={boardW(40)} weight={700} color="dark.3">
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

      {/* Continue to the next screen button */}
      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
