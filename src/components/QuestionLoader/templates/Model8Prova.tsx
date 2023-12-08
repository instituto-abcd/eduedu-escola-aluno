import {
  Box,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconVolume } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const showTextOptionExceptions = [35, 36, 79, 80, 87, 88];

export function Model8Prova({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles, textTitles, imageTitles, videoTitles, hasAudioTitle } =
    useQuestionHelper(question);
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
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton key={inx} src={title.file_url ?? ""} autoPlay />
          ))}
        </Group>
      )}

      <Stack my="auto" w="100%">
        {textTitles.map((title, inx) => (
          <Title color="dark.3" size="3vh" align="center" key={inx}>
            {title.description}
          </Title>
        ))}

        <Group noWrap w="100%" spacing={boardW(40)} position="center">
          {imageTitles.map((title, inx) => (
            <Image
              src={title.file_url}
              alt={title.description}
              key={inx}
              width={boardW(500)}
            />
          ))}

          {videoTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <Box key={inx}>
                <VideoPlayer src={title.file_url ?? ""} autoPlay />
              </Box>
            ))}

          {showTextOptionExceptions.includes(question.id) && (
            <Stack mx="auto" w="45%" spacing={20}>
              {question.options.map((option, inx) =>
                showTextOptionExceptions.includes(question.id) ? (
                  <TextOptionButton
                    key={inx}
                    onClick={() => setAnswer(option)}
                    data-selected={answer?.position === option.position}
                    style={{ width: "100%" }}
                    option={option}
                    debug={{ size: 12 }}
                  >
                    {showTextOptionExceptions.includes(question.id) && (
                      <Text
                        size={boardW(22)}
                        color="blue.6"
                        weight={600}
                        style={{
                          wordWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {option.description}
                      </Text>
                    )}
                  </TextOptionButton>
                ) : (
                  <OptionButton
                    key={inx}
                    onClick={() => setAnswer(option)}
                    data-selected={answer?.position === option.position}
                    option={option}
                    debug={{ size: 12 }}
                  >
                    <Stack justify="space-evenly">
                      <IconVolume size={boardW(62)} />
                      <Text color="dark.6" size={boardW(30)} weight={400}>
                        {inx + 1}
                      </Text>
                    </Stack>
                  </OptionButton>
                )
              )}
            </Stack>
          )}
          {!showTextOptionExceptions.includes(question.id) && (
            <SimpleGrid cols={2} w="45%">
              {question.options.map((option, inx) =>
                showTextOptionExceptions.includes(question.id) ? (
                  <TextOptionButton
                    key={inx}
                    onClick={() => setAnswer(option)}
                    data-selected={answer?.position === option.position}
                    option={option}
                    debug={{ size: 12 }}
                  >
                    {showTextOptionExceptions.includes(question.id) && (
                      <Text
                        size={boardW(22)}
                        color="blue.6"
                        weight={600}
                        style={{
                          wordWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {option.description}
                      </Text>
                    )}
                  </TextOptionButton>
                ) : (
                  <OptionButton
                    key={inx}
                    onClick={() => setAnswer(option)}
                    data-selected={answer?.position === option.position}
                    option={option}
                    debug={{ size: 12 }}
                  >
                    <Stack justify="space-evenly">
                      <IconVolume size={boardW(62)} />
                      <Text color="blue.6" size={boardW(30)} weight={600}>
                        {inx + 1}
                      </Text>
                    </Stack>
                  </OptionButton>
                )
              )}
            </SimpleGrid>
          )}
        </Group>
      </Stack>
    </>
  );
}
