// Aux & Utils:
import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { Answer, useGetExamQuestion } from "~/api/student";
import { lousaHeight, lousaPaddingTop, lousaWidth, textoMedium } from "~/constants/dimensions";
import { ModelProps } from ".";

// Components:
import { EduButton } from "~/components/EduButton";
import { Box, Group, Image, LoadingOverlay, SimpleGrid, Stack, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { AudioButton } from "~/components/AudioButton";

export function Model10Prova({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const { imageTitles, textTitles, audioTitles } = useQuestionHelper(question);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (answer === null) return;

    mutate({
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
      <Group mx="auto">
        {audioTitles.map((title) => (
          <AudioButton
            src={title.file_url ?? ""}
            key={title.file_url}
            autoPlay
          />
        ))}

        {/* TODO: botão livro? */}
        {/* <IconButton icon={<IconBook size={34} />} variant="black" /> */}
      </Group>

      {/* Board content */}
      <Stack
        my="auto"
        pt={lousaPaddingTop}
      >
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

        <Group
          mx="auto"
          spacing={(lousaWidth * 5 / 100)}
        >
          <Box maw={lousaWidth * 50 / 100}>
            {imageTitles.map((title) => (
              <Image
                src={title.file_url}
                alt={title.description}
                width={(lousaWidth * 30 / 100).toString()}
                key={title.file_url}
              />
            ))}
          </Box>
          <Box maw={lousaWidth * 50 / 100}>
            <SimpleGrid cols={2}>
              {question.options.map((option) => (
                <OptionButton
                  key={option.description}
                  onClick={() =>
                    setAnswer({
                      position: option.position,
                      positionAnswer: option.position,
                    })
                  }
                  data-selected={answer?.position === option.position}
                  isCorrect={option.isCorrect}
                >
                  {option.description}
                </OptionButton>
              ))}
            </SimpleGrid>
          </Box>
        </Group>
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: "auto"
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
