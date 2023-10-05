import {
  Box,
  Group,
  Image,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconVolume } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { useGetExamQuestion } from "~/api/student";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";

const showTextOptionExceptions = [35, 36, 79, 80, 87, 88];

export function Model8Prova({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles, imageTitles, videoTitles, hasAudioTitle } =
    useQuestionHelper(question);
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

  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setAnswer(null);
  }, [question]);

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

        <Group noWrap w="100%" spacing={boardW(80)} position="center">
          {imageTitles.map((title, inx) => (
            <Image
              src={title.file_url}
              alt={title.description}
              key={inx}
              width={boardW(250)}
            />
          ))}

          {videoTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <Box key={inx}>
                <VideoPlayer
                  src={title.file_url ?? ""}
                  onPlayStatusChange={mediaTrack.setPlayStatus}
                  canPlay={mediaTrack.canPlay()}
                  autoPlay
                />
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
                    sound={option.sound_url ?? undefined}
                    isCorrect={option.isCorrect}
                    style={{ width: "100%" }}
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
                    sound={option.sound_url ?? undefined}
                    isCorrect={option.isCorrect}
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
                    sound={option.sound_url ?? undefined}
                    isCorrect={option.isCorrect}
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
                    sound={option.sound_url ?? undefined}
                    isCorrect={option.isCorrect}
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

      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: "auto",
        }}
      >
        Continuar
      </EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
