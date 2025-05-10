import { Box, Group, Image, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function QME2x3Video({
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

  useEffect(() => {
    setSelected([]);
  }, [question]);

  const { videoTitles, optionArrKey } = useQuestionHelper(question);

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
        noWrap
        grow
        spacing={((lousaHeight * 0.5) / 100).toString() + "vh"}
        my="auto"
        pt={((lousaHeight * 0.5) / 100).toString() + "vh"}
        style={{ minWidth: "70%" }}
      >
        <Box maw={(lousaWidth * 50) / 100}>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            autoPlay
          />
        </Box>

        <Box
          maw={(lousaWidth * 50) / 100}
          style={{ minWidth: "30%" }}
        >
          <SimpleGrid
            cols={2}
            spacing={20}
          >
            {question.options.map((option, inx) => (
              <OptionButton
                key={optionArrKey(option, inx)}
                data-selected={
                  !!selected.find((item) => item.position === option.position)
                }
                onClick={() => selectItem(option)}
                option={option}
              >
                {option.image_url && (
                  <Image
                    src={option.image_url}
                    alt={option.description}
                    width="100%"
                  />
                )}
                {!option.image_url && option.description && (
                  <Text>{option.description}</Text>
                )}
              </OptionButton>
            ))}
          </SimpleGrid>
        </Box>
      </Group>
    </>
  );
}
