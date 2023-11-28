import { Group, Image, Stack, Text } from "@mantine/core";
import { IconMessageCircle2 } from "@tabler/icons-react";
import Lottie from "react-lottie";
import lottieFile from "~/assets/lotties/lottie_speak_up_button.json";
import { AudioButton } from "~/components/AudioButton";
import { lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useEffect } from "react";
import { useTimeout } from "@mantine/hooks";

export function Model33({ question, onConditionsChange }: ModelProps) {
  const {
    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    imageTitles,
    textTitles,
    getRule,
  } = useQuestionHelper(question);
  const illustration = imageTitles[0]?.file_url ?? "";

  const hasTextOrImage =
    !!illustration || textTitles.some((title) => title.file_url);

  const autoplayLaterAudio = () => {
    const rule = getRule("autoplay");

    if (!rule) return true;
    return rule.value === "false";
  };

  const { start } = useTimeout(() => onConditionsChange([]), 1000);

  useEffect(() => {
    start();
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) =>
            inx === 0 ? (
              <AudioButton
                key={inx}
                src={title.file_url ?? ""}
                autoPlay={
                  question.rules.length > 0 ? audioTitleAutoplay(inx) : false
                }
              />
            ) : (
              <AudioButton
                key={inx}
                src={title.file_url ?? ""}
                variant="yellow"
                icon={<IconMessageCircle2 size={30} />}
                autoPlay={autoplayLaterAudio()}
              />
            )
          )}
        </Group>
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
