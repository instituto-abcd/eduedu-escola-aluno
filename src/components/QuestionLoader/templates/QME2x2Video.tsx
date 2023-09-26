// Aux & Utils:
import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { useGetExamQuestion } from "~/api/student";
import { QuestionOption } from "~/api/exam";
import { lousaPaddingTop, lousaWidth, scrollAreaHeight, scrollAreaWidth } from "~/constants/dimensions";
import { ModelProps } from ".";

// Components:
import { Group, Image, LoadingOverlay, ScrollArea, SimpleGrid, Text } from "@mantine/core";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";

// Icons:
import { IconVolume } from "@tabler/icons-react";

export function QME2x2Video({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
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

  const { videoTitles } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {/* Board content */}
      <Group
        my="auto"
        pt={lousaPaddingTop}
        spacing={(lousaWidth * 5 / 100)}
      >
        <div>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            autoPlay
            customHeight={(lousaWidth * 30 / 100).toString()}
          />
        </div>

        {/* Second column (ATTENTION: it was coded to use only 2 cards!!! )*/}
        <ScrollArea
          mah={scrollAreaHeight}
          maw={scrollAreaWidth * 70 / 100}
        >
          <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={20}>
            {question.options.map((option) => (
              <OptionButton
                key={option.position}
                data-selected={JSON.stringify(answer) === JSON.stringify(option)}
                sound={option.sound_url ?? ""}
                onClick={() => setAnswer(option)}
                isCorrect={option.isCorrect}
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
        </ScrollArea>
      </Group>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={answer === null}
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
