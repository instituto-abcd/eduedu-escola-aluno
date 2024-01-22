import { Group, Image, Stack, Text } from "@mantine/core";
import Lottie from "react-lottie";
import lottieFile from "~/assets/lotties/lottie_speak_up_button.json";
import { lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useEffect } from "react";
import { useTimeout } from "@mantine/hooks";
import { AudioContainer } from "~/components/AudioContainer";

export function Model33({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, hasAudioTitle, imageTitles, textTitles } = useQuestionHelper(question);
  const illustration = imageTitles[0]?.file_url ?? "";

  const hasTextOrImage =
    !!illustration || textTitles.some((title) => title.file_url);

  const { start } = useTimeout(() => onConditionsChange([]), 1000);

  useEffect(() => {
    start();
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <AudioContainer question={question} audioTitles={audioTitles} hasPrimaryIcon={false} />
      )}

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
