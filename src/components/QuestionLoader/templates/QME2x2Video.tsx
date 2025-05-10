import { Box, Group, Image, SimpleGrid, Text } from "@mantine/core";
import { IconVolume } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function QME2x2Video({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { videoTitles } = useQuestionHelper(question);

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
      <div className="flex flex-nowrap w-full h-full items-center justify-center">
        <Box w="45%">
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            autoPlay
            style={{ height: boardW(250) }}
          />
        </Box>

        <SimpleGrid
          cols={2}
          style={{ placeItems: "center", marginBottom: "5px" }}
          w="45%"
        >
          {question.options.map((option) => (
            <OptionButton
              key={option.position}
              data-selected={JSON.stringify(answer) === JSON.stringify(option)}
              onClick={() => setAnswer(option)}
              option={option}
            >
              {option.image_url && (
                <Image
                  src={option.image_url}
                  alt={option.description}
                  width="100%"
                />
              )}
              {!option.image_url && option.sound_url && (
                <IconVolume size={80} />
              )}
              {!option.image_url && !option.sound_url && option.description && (
                <Text>{option.description}</Text>
              )}
            </OptionButton>
          ))}
        </SimpleGrid>
      </div>
    </>
  );
}
