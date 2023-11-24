import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { boardW } from "~/constants/dimensions";
import { Group, Box, SimpleGrid, createStyles } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { QuestionOption } from "~/api/exam";
import { ModelProps } from ".";

const useStyles = createStyles({
  option: {
    width: boardW(130),
    height: boardW(130),
  },
});

export function Model3({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { classes } = useStyles();
  const { videoTitles } = useQuestionHelper(question);
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
      <Group m="auto" spacing={boardW(50)}>
        <Box maw={boardW(400)}>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            autoPlay
            style={{ height: boardW(240) }}
          />
        </Box>
        <Box maw={boardW(550)}>
          <SimpleGrid cols={2}>
            {question.options.map((option, inx) => (
              <OptionButton
                key={inx}
                onClick={() => setAnswer(option)}
                data-selected={
                  JSON.stringify(answer) === JSON.stringify(option)
                }
                className={classes.option}
                option={option}
              >
                {option.image_url && (
                  <img
                    src={option.image_url}
                    alt={option.description}
                    height={105}
                    width="auto"
                    style={{
                      maxHeight: 120,
                      maxWidth: "100%",
                      objectFit: "contain",
                      marginInline: "auto",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                )}
                {option.description}
              </OptionButton>
            ))}
          </SimpleGrid>
        </Box>
      </Group>
    </>
  );
}
