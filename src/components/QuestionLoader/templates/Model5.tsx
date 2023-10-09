import {
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Title,
  createStyles,
} from "@mantine/core";
import { useState } from "react";
import { usePlanetAnswer, usePlanetGetQuestion } from "~/api/planet";
import { useGetExamQuestion } from "~/api/student";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";
import { QuestionOption } from "~/api/exam";
import { AuxAudioButton } from "~/components/AuxAudioButton";

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

export function Model5({ question, answerCallback }: ModelProps) {
  const {
    audioTitles,
    videoTitles,
    textTitles,
    imageTitles,
    isExam,
    hasAudioTitle,
    audioTitleAutoplay,
    supportText,
  } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const [multipleAnswer, setMultipleAnswer] = useState<QuestionOption[]>([]);
  const mediaTrack = useMediaTrackStore();
  const { classes } = useStyles();

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;
  const disabled = question.multiplesAnswer
    ? multipleAnswer.length === 0
    : !answer;

  function submitAnswer() {
    if (disabled) return;

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: question.multiplesAnswer
          ? multipleAnswer
          : answer
          ? [answer]
          : [],
      });
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: question.multiplesAnswer
          ? multipleAnswer
          : answer
          ? [answer]
          : [],
      });
    }
  }

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
  console.log(supportText, hasSupportText);

  const { data: auxQuestion } = usePlanetGetQuestion(
    question.planet_id,
    supportText.find(
      (title) => title.description && title.description.length > 3
    )?.description ?? "",
    {
      enabled: hasSupportText,
    }
  );

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
          {auxQuestion && <AuxAudioButton question={auxQuestion} />}
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
                onClick={() => setAnswer(option)}
                data-selected={
                  JSON.stringify(answer) === JSON.stringify(option)
                }
                className={classes.textOption}
              >
                {option.description}
              </TextOptionButton>
            )
          )}
        </SimpleGrid>
      </Group>

      <EduButton disabled={disabled} onClick={submitAnswer}>
        Continuar
      </EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
