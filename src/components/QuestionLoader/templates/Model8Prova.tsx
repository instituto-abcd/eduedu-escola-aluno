// Aux & Utils:
import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useGetExamQuestion } from "~/api/student";
import { QuestionOption } from "~/api/exam";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { lousaPaddingTop, lousaWidth } from "~/constants/dimensions";
import { ModelProps } from ".";

// Components:
import {
  Title,
  Group,
  LoadingOverlay,
  Image,
  Stack,
  Text,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";

// Icons:
import { IconVolume } from "@tabler/icons-react";

const showTextOptionExceptions = [35, 36, 79, 80, 87, 88];

export function Model8Prova({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles, imageTitles, videoTitles } =
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
      {/* Action buttons */}
      <Group mx="auto">
        {audioTitles.map((title, inx) => (
          <AudioButton key={inx} src={title.file_url ?? ""} autoPlay />
        ))}
      </Group>

      {/* Board content */}
      <Stack
        my="auto"
        pt={lousaPaddingTop}
        spacing={(lousaWidth * 5 / 100)}
      >
        {textTitles.map((title, inx) => (
          <Title color="dark.3" size="2.5vh" align="center" key={inx}>
            {title.description}
          </Title>
        ))}

        <Group
          noWrap
          my="auto"
          pt={lousaPaddingTop}
        >
          {imageTitles.map((title, inx) => (
            <Box mx="auto" key={inx}>
              <Image
                src={title.file_url}
                alt={title.description}
                key={title.file_url}
                width={(lousaWidth * 40 / 100).toString()}
              />
            </Box>
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
                  customHeight={(lousaWidth * 30 / 100).toString()}
                />
              </Box>
            ))}

          {showTextOptionExceptions.includes(question.id) && (
            <Stack
              mx="auto"
              spacing={20}
              m={0}
            >
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
                        size="1.8vh"
                        color="blue.6"
                        weight={400}
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
                      <IconVolume size={62} />
                      <Text color="dark.6" size={30} weight={400}>
                        {inx + 1}
                      </Text>
                    </Stack>
                  </OptionButton>
                )
              )}
            </Stack>
          )}
          {!showTextOptionExceptions.includes(question.id) && (
            <SimpleGrid cols={2}>
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
                        size={14}
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
                      <IconVolume size={62} />
                      <Text color="blue.6" size={30} weight={600}>
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

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: "auto",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
