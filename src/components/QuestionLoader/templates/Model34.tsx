import {
  BackgroundImage,
  Box,
  Group,
  SimpleGrid,
  createStyles,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

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
        <Box w="100%" maw={boardW(400)}>
          <BackgroundImage
            h={boardW(350)}
            mb={10}
            src={imageTitles[0].file_url!}
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
          ></DraggableCardSlot>
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
    </>
  );
}
