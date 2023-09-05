import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { Group, LoadingOverlay, SimpleGrid, createStyles } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { QuestionOption } from "~/api/exam";
import { useEffect, useState } from "react";
import { EduButton } from "~/components/EduButton";
import { usePlanetAnswer } from "~/api/planet";

const useStyles = createStyles({
  slot: {
    display: "grid",
    placeItems: "center",
  },
});

export function Model34({ question, answerCallback }: ModelProps) {
  const { audioTitles, imageTitles } = useQuestionHelper(question);
  const { classes } = useStyles();

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [answer],
    });
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      <Group>
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

      <Group my="auto" spacing={100} align="center">
        <DraggableCardSlot
          item={answer}
          onDrop={(item) => setAnswer(item)}
          className={classes.slot}
          replaceWith={
            <DraggableCard
              item={answer}
              image={answer?.image_url}
              text={answer?.description}
              sound={answer?.sound_url}
              onClear={() => setAnswer(null)}
              disabled
            />
          }
        >
          <img
            src={imageTitles[0].file_url!}
            width={160}
            style={{ maxHeight: 200 }}
          />
        </DraggableCardSlot>

        <SimpleGrid cols={2}>
          {question.options.map((item, inx) => (
            <DraggableCard
              key={inx}
              item={item}
              image={item.image_url}
              text={item.description}
              sound={item.sound_url}
              hidden={!!answer}
            />
          ))}
        </SimpleGrid>
      </Group>

      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
