import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { boardW } from "~/constants/dimensions";

// Components:
import { Group, Box, SimpleGrid, Image, createStyles } from "@mantine/core";
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

export function Model3({ question, onAnswerChange }: ModelProps) {
  const { classes } = useStyles();

  const { videoTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState({});
  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);

  function onDrop(item: QuestionOption | null) {
    setAnswer({
      position: item?.position,
      positionAnswer: item?.position,
    });
    setAnswers([{ ...item, positionAnswer: item?.position } as QuestionOption]);
  }

  useEffect(() => {
    setAnswer({});
    setAnswers([]);
    setOptions(question?.options);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers);
  }, [answers]);

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
            {options &&
              options.map((item: QuestionOption, index: number) => (
                <OptionButton
                  key={index}
                  onClick={() => onDrop(item)}
                  data-selected={answer?.position === item?.position}
                  className={classes.option}
                >
                  <Image
                    height={boardW(120)}
                    width="auto"
                    src={item?.image_url}
                  />
                  {item?.description}
                </OptionButton>
              ))}
          </SimpleGrid>
        </Box>
      </Group>
    </>
  );
}
