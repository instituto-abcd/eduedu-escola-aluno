import { Box, Group, SimpleGrid, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { boardW, lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  slot: {
    width: (lousaWidth * 40) / 100,
    height: (lousaHeight * 40) / 100,
    display: "grid",
    placeItems: "center",
  },
  card: {
    width: (lousaWidth * 40) / 100,
    height: (lousaHeight * 40) / 100,
  },
  cardWide: {
    width: "100%!important",
  },
});

export function Model34({ question, onAnswerChange }: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay, imageTitles } =
    useQuestionHelper(question);
  const { classes } = useStyles();

  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

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
        </Group>
      )}

      <Group
        my="auto"
        w="100%"
        spacing={boardW(4)}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Box
          w="100%"
          maw={(lousaWidth * 40) / 100}
          display="flex"
          style={{ alignItems: "center" }}
        >
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
            <img
              src={imageTitles[0].file_url!}
              width={(lousaWidth * 35) / 100}
              style={{
                height: "auto",
                maxHeight: (lousaHeight * 35) / 100,
              }}
            />
          </DraggableCardSlot>
        </Box>
        <Box maw={(lousaWidth * 40) / 100} w="100%">
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
    </>
  );
}
