import { Group, Image, LoadingOverlay, Stack, Text } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import Lottie from "react-lottie";
import lottieFile from "~/assets/lotties/lottie_speak_up_button.json";
import { IconMessageCircle2 } from "@tabler/icons-react";
import { useEffect } from "react";
import { usePlanetAnswer } from "~/api/planet";

export function Model33({ question, answerCallback }: ModelProps) {
  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);
  const illustration = imageTitles[0]?.file_url ?? "";
  const mediaTrack = useMediaTrackStore();

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (mediaTrack.isPlaying) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [],
    });
  }

  useEffect(() => {
    if (audioTitles[0].file_url && !mediaTrack.isPlaying) {
      mediaTrack.play({
        mediaType: MediaType.AUDIO,
        trackId: audioTitles[0].file_url,
        trackUrl: audioTitles[0].file_url,
      });
    }
  }, [question]);

  return (
    <>
      <Group>
        {audioTitles.map((title, inx) =>
          inx === 0 ? (
            <AudioButton key={title.position} src={title.file_url ?? ""} />
          ) : (
            <AudioButton
              key={title.position}
              src={title.file_url ?? ""}
              buttonProps={{
                variant: "yellow",
                icon: <IconMessageCircle2 size={30} />,
              }}
            />
          )
        )}
      </Group>

      <Group position="apart" spacing={137} w="100%" noWrap my="auto">
        <Stack align="center" spacing={0}>
          <Image src={illustration} width={346} height="auto" />
          {textTitles.map((title) => (
            <Text size={50} color="dark.3" weight={500} key={title.description}>
              {title.description}
            </Text>
          ))}
        </Stack>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: lottieFile,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height="auto"
          width={346}
        />
      </Group>

      <EduButton disabled={mediaTrack.isPlaying} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
