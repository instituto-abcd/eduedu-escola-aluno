import { Group, SimpleGrid, Stack, Title, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";

const useStyles = createStyles({
  option: {
    width: boardW(140),
    height: boardW(140),

    img: {
      maxWidth: boardW(100),
      maxHeight: boardW(100),
      objectFit: "contain",
    },
  },

  textOption: {
    width: "100%",
    height: "min-content",
    paddingBlock: boardW(16),
    paddingInline: boardW(26),
    fontSize: boardW(20),
  },

  title: {
    fontSize: boardW(26),
  },
});

export function Model5({
  question,
  onAnswerChange,
  setContinueDisabled,
  auxQuestion,
}: ModelProps) {
  const {
    audioTitles,
    videoTitles,
    textTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    supportText,
  } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const [multipleAnswer, setMultipleAnswer] = useState<QuestionOption[]>([]);
  const mediaTrack = useMediaTrackStore();
  const { classes } = useStyles();

  function handleOptionClick(option: QuestionOption) {
    if (question.multiplesAnswer) {
      if (multipleAnswer.includes(option)) {
        setMultipleAnswer(
          multipleAnswer.filter(
            (opt) => JSON.stringify(opt) !== JSON.stringify(option)
          )
        );
      } else {
        setMultipleAnswer([...multipleAnswer, option]);
      }
    } else setAnswer(option);
  }

  function getSelectedState(option: QuestionOption) {
    if (question.multiplesAnswer) {
      return multipleAnswer.includes(option);
    } else {
      return JSON.stringify(answer) === JSON.stringify(option);
    }
  }

  const hasVideo = videoTitles.some((title) => title.file_url);
  const hasText = textTitles.some(
    (title) => !title.placeholder?.startsWith("ID")
  );
  const hasImage = imageTitles.some((title) => title.file_url);
  const hasSupportText = supportText.some((title) => !!title.description);

  /* Handle answer */
  useEffect(() => {
    if (question.multiplesAnswer) {
      onAnswerChange(multipleAnswer);
    } else {
      onAnswerChange(answer ? [answer] : []);
    }
  }, [answer, multipleAnswer]);

  /* Handle continue disable */
  useEffect(() => {
    if (question.multiplesAnswer) {
      setContinueDisabled(multipleAnswer.length === 0);
    } else {
      setContinueDisabled(!answer);
    }
  }, [answer, multipleAnswer]);

  /* handle clear answers */
  useEffect(() => {
    setAnswer(null);
    setMultipleAnswer([]);
  }, [question]);

  return (
    <>
      {(hasAudioTitle || hasSupportText) && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url ?? ""}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </Group>
      )}

      <Group spacing={boardW(80)} my="auto" w="100%">
        <Stack w="45%" align="center">
          {!hasVideo && hasText && (
            <Title
              color="dark.3"
              align="center"
              my="auto"
              maw={400}
              dangerouslySetInnerHTML={{
                __html:
                  textTitles.find(
                    (title) =>
                      !title.placeholder?.startsWith("ID") ||
                      !title.placeholder?.includes("ID")
                  )?.description ?? "",
              }}
              className={classes.title}
            />
          )}
          {hasImage &&
            imageTitles
              .filter((title) => title.file_url)
              .map((title, inx) => (
                <img
                  src={title.file_url!}
                  width={boardW(300)}
                  style={{ maxHeight: boardW(400) }}
                  key={inx}
                />
              ))}
          {videoTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <VideoPlayer
                src={title.file_url!}
                key={inx}
                autoPlay
                onPlayStatusChange={mediaTrack.setPlayStatus}
                canPlay={mediaTrack.canPlay()}
              />
            ))}
        </Stack>

        <SimpleGrid
          cols={question.options.some((op) => !!op.image_url) ? 2 : 1}
          w="45%"
        >
          {question.options.map((option, inx) =>
            option.image_url ? (
              <OptionButton
                key={inx}
                onClick={() => handleOptionClick(option)}
                data-selected={getSelectedState(option)}
                sound={option.sound_url ?? undefined}
                className={classes.option}
              >
                <img src={option.image_url} alt={option.description} />
              </OptionButton>
            ) : (
              <TextOptionButton
                key={inx}
                onClick={() => handleOptionClick(option)}
                data-selected={getSelectedState(option)}
                className={classes.textOption}
              >
                {option.description}
              </TextOptionButton>
            )
          )}
        </SimpleGrid>
      </Group>
    </>
  );
}
