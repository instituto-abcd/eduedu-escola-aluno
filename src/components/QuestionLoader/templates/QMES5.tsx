import { Box, Group, ScrollArea, SimpleGrid } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function QMES5({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);

  function selectItem(answer: QuestionOption) {
    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          ...answer,
          positionAnswer: answer.position,
        } as QuestionOption,
      ]);
    }
  }

  const { videoTitles, optionArrKey } = useQuestionHelper(question);

  useEffect(() => {
    setSelected([]);
  }, [question]);

  useEffect(() => {
    onAnswerChange(selected);
  }, [selected]);

  const conditions = useMemo(() => [selected.length > 0], [selected]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      <Group
        w="100%"
        m="auto"
      >
        <Box
          h="100%"
          w="100%"
          maw={boardW(440)}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Box m="auto">
            <VideoPlayer
              src={videoTitles[0]?.file_url ?? ""}
              autoPlay
            />
          </Box>
        </Box>

        <ScrollArea style={{ minWidth: "30%", minHeight: "30%" }}>
          <SimpleGrid
            cols={2}
            spacing={20}
            style={{
              marginBottom: "5px",
            }}
          >
            {question.options.map((option, inx) => (
              <OptionButton
                key={optionArrKey(option, inx)}
                onClick={() => selectItem(option)}
                data-selected={
                  !!selected.find((item) => item.position === option.position)
                }
                option={option}
              >
                {option.description}
              </OptionButton>
            ))}
          </SimpleGrid>
        </ScrollArea>
      </Group>
    </>
  );
}
