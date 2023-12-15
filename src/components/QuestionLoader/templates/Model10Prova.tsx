import { Box, Group, Image, SimpleGrid, Stack, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { ReadButton } from "~/components/ReadButton";
import {
  lousaPaddingTop,
  lousaWidth,
  textoMedium,
} from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model10Prova({
  question,
  onAnswerChange,
  auxQuestion,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, audioTitles } = useQuestionHelper(question);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  return (
    <>
      <Group mx="auto">
        {audioTitles.map((title) => (
          <AudioButton
            src={title.file_url ?? ""}
            key={title.file_url}
            autoPlay={true}
          />
        ))}

        {auxQuestion && <ReadButton question={auxQuestion} />}
      </Group>

      <Stack my="auto" pt={lousaPaddingTop}>
        {textTitles.map((title) => (
          <Title
            key={title.description}
            align="center"
            color="dark.3"
            size={textoMedium}
            mb={20}
          >
            {title.description}
          </Title>
        ))}

        <Group mx="auto" spacing={(lousaWidth * 5) / 100}>
          <Box maw={(lousaWidth * 50) / 100}>
            {imageTitles.map((title) => (
              <Image
                src={title.file_url}
                alt={title.description}
                width={((lousaWidth * 30) / 100).toString()}
                key={title.file_url}
              />
            ))}
          </Box>
          <Box maw={(lousaWidth * 50) / 100}>
            <SimpleGrid cols={2}>
              {question.options.map((option) => (
                <OptionButton
                  key={option.description}
                  onClick={() => setAnswer(option)}
                  data-selected={answer?.position === option.position}
                  option={option}
                >
                  {option.description}
                </OptionButton>
              ))}
            </SimpleGrid>
          </Box>
        </Group>
      </Stack>
    </>
  );
}
