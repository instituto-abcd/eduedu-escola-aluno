// Aux & Utils:
import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";

// Components:
import { Group, LoadingOverlay, SimpleGrid, createStyles, Box } from "@mantine/core";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";

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
        w="100%"
        h="85%"
        spacing={(lousaWidth * 5 / 100)}
        style={{ display: 'flex', justifyContent: "center" }}
      >
        <Box
          w="100%"
          maw={lousaWidth * 40 / 100}
          h="100%"
          display="flex"
          style={{ alignItems: "center" }}
        >
          <DraggableCardSlot
            item={answer}
            onDrop={(item) => setAnswer(item)}
            className={classes.slot}
            customWidth={lousaWidth * 40 / 100}
            customHeight={lousaHeight * 40 / 100}
            replaceWith={
              <DraggableCard
                item={answer}
                image={answer?.image_url}
                text={answer?.description}
                sound={answer?.sound_url}
                onClear={() => setAnswer(null)}
                disabled
                customWidth={lousaWidth * 40 / 100}
                customHeight={lousaHeight * 40 / 100}
              />
            }
          >
            <img
              src={imageTitles[0].file_url!}
              width={lousaWidth * 35 / 100}
              style={{
                height: 'auto',
                maxHeight: lousaHeight * 35 / 100
              }}
            />
          </DraggableCardSlot>
        </Box>
        <Box maw={lousaWidth * 40 / 100} w="100%" h="100%">
          <SimpleGrid cols={2}>
            {question.options.map((item, inx) => (
              <DraggableCard
                key={inx}
                item={item}
                image={item.image_url}
                text={item.description}
                sound={item.sound_url}
                hidden={!!answer}
                customWidth="100%"
              />
            ))}
          </SimpleGrid>
        </Box>
      </Group>

      {/* Continue to the next screen button */}
      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
