import { Box, Group, SimpleGrid, Stack, createStyles } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DraggableCard, DraggableCardSlot } from "~/components/DraggableCard";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  slot: {
    margin: "auto",
    width: boardW(100),
    height: boardW(100),
    display: "grid",
    placeItems: "center",
  },
  card: {
    margin: "auto",
    width: `${boardW(100)}px!important`,
    height: `${boardW(100)}px!important`,
  },
  cardWide: {
    width: "100%!important",
  },
});

export function Model34({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
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

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

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
        <Stack w="100%" maw={boardW(400)} spacing={10}>
          <img style={{ height: boardW(350) }} src={imageTitles[0].file_url!} />
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
          />
        </Stack>
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
                debug={{ debugProperty: "isCorrect" }}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Group>
    </>
  );
}
