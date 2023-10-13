// Aux & Utils:
import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { boardW, lousaHeight } from "~/constants/dimensions";

// Components:
import { Group, LoadingOverlay, SimpleGrid, createStyles, Box, BackgroundImage } from "@mantine/core";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";

const useStyles = createStyles({
  slot: {
    width: boardW(100),
    height: boardW(100),
    display: "grid",
    placeItems: "center",
  },
  card: {
    width: `${boardW(100)}px!important`,
    height: `${boardW(100)}px!important`,
  },
  cardWide: {
    width: '100%!important'
  }
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
      <Group
        my="auto"
        w="100%"
        spacing={boardW(4)}
        style={{ display: 'flex', justifyContent: "center" }}
      >
        <Box
          w="100%"
          maw={boardW(400)}
          align="center"
        >
          <BackgroundImage
            h={boardW(350)}
            mb={10}
            src={imageTitles[0].file_url}
          />
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
                className={classes.card}
              />
            }
          >
          </DraggableCardSlot>

        </Box>
        <Box maw={boardW(400)} w="100%">
          <SimpleGrid cols={2}>
            {question.options.map((item, inx) => (
              <DraggableCard
                key={inx}
                item={item}
                image={item.image_url}
                text={item.description}
                sound={item.sound_url}
                hidden={!!answer}
                className={classes.cardWide}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Group>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}>
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
