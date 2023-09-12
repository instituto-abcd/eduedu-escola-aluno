import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
  Title,
  Group,
  LoadingOverlay,
  Image,
  Stack,
  Text,
  SimpleGrid,
  Center,
} from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { IconVolume } from "@tabler/icons-react";
import { useGetExamQuestion } from "~/api/student";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { BOARD_WIDTH } from "~/constants/dimensions";

const showTextOptionExceptions = [79, 80, 87, 88];

export function Model8Prova({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles, imageTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (!answer) return;

    mutate({
      questionId: question.id,
      optionsAnswered: [answer] as QuestionOption[],
    });
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {audioTitles.map((title, inx) => (
        <AudioButton key={inx} src={title.file_url ?? ""} autoPlay />
      ))}

      {textTitles.map((title, inx) => (
        <Title color="dark.3" size={30} align="center" key={inx}>
          {title.description}
        </Title>
      ))}

      <Group my="auto" w={BOARD_WIDTH} noWrap>
        {imageTitles.map((title, inx) => (
          <Center w="100%" key={inx}>
            <Image
              src={title.file_url}
              alt={title.description}
              width={"100%"}
              key={title.file_url}
            />
          </Center>
        ))}

        <Center w="100%">
          <SimpleGrid cols={2}>
            {question.options.map((option, inx) => (
              <OptionButton
                key={inx}
                onClick={() => setAnswer(option)}
                data-selected={answer?.position === option.position}
                sound={option.sound_url ?? undefined}
                isCorrect={option.isCorrect}
              >
                {!showTextOptionExceptions.includes(question.id) && (
                  <Stack justify="space-evenly">
                    <IconVolume size={62} />
                    <Text color="dark.6" size={30} weight={400}>
                      {inx + 1}
                    </Text>
                  </Stack>
                )}
                {showTextOptionExceptions.includes(question.id) && (
                  <Text
                    size={14}
                    color="gray.7"
                    weight={600}
                    style={{ wordWrap: "break-word", wordBreak: "break-word" }}
                  >
                    {option.description}
                  </Text>
                )}
              </OptionButton>
            ))}
          </SimpleGrid>
        </Center>
      </Group>

      <EduButton disabled={!answer} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
