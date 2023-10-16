import { Group, Image, Stack, Text } from "@mantine/core";
import { IconMessageCircle2 } from "@tabler/icons-react";
import { useEffect } from "react";
import Lottie from "react-lottie";
import lottieFile from "~/assets/lotties/lottie_speak_up_button.json";
import { AudioButton } from "~/components/AudioButton";
import { lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";

export function Model33({ question }: ModelProps) {
  const { audioTitles, imageTitles, textTitles } = useQuestionHelper(question);
  const illustration = imageTitles[0]?.file_url ?? "";
  const mediaTrack = useMediaTrackStore();

  const hasTextOrImage =
    !!illustration || textTitles.some((title) => title.file_url);

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

      <Group noWrap m="auto" spacing={(lousaWidth * 10) / 100}>
        {hasTextOrImage && (
          <Stack align="center" spacing={0}>
            {illustration && (
              <Image
                src={illustration}
                width={((lousaWidth * 30) / 100).toString()}
                height="auto"
              />
            )}

            {textTitles.map((title) => (
              <Text
                size={50}
                color="dark.3"
                weight={500}
                key={title.description}
              >
                {title.description}
              </Text>
            ))}
          </Stack>
        )}

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
          width={(lousaWidth * 30) / 100}
        />
      </Group>
    </>
  );
}
