import { Group, Image, Stack, Text } from "@mantine/core";
import { IconMessageCircle2 } from "@tabler/icons-react";
import Lottie from "react-lottie";
import lottieFile from "~/assets/lotties/lottie_speak_up_button.json";
import { AudioButton } from "~/components/AudioButton";
import { lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useTimeout } from "@mantine/hooks";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";

export function Model33({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, hasAudioTitle, imageTitles, textTitles, getRule } =
    useQuestionHelper(question);
  const illustration = imageTitles[0]?.file_url ?? "";

  const hasTextOrImage =
    !!illustration || textTitles.some((title) => title.file_url);

  /* Autoplay logic */
  const autoplayRule = getRule("autoplay");
  const shouldPlay = autoplayRule?.value === "false" ? false : true;

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxAudioRef = useRef<AudioButtonRef>(null);

  useLayoutEffect(() => {
    if (mainAudioRef.current && auxAudioRef.current) {
      if (shouldPlay) {
        mainAudioRef.current.sound.onEnd(() => {
          auxAudioRef.current!.sound.play();
        });
      }
    }

    return () => {
      auxAudioRef.current?.sound.destroy();
    };
  }, [question]);
  /* End autoplay logic */

  const { start } = useTimeout(() => onConditionsChange([]), 1000);

  useEffect(() => {
    start();
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => {
            const props = {
              ref: inx === 0 ? mainAudioRef : auxAudioRef,
              autoPlay:
                inx === 0 ? shouldPlay : shouldPlay === false ? true : false,
              icon: inx > 0 ? <IconMessageCircle2 size={30} /> : undefined,
              variant: inx > 0 ? "yellow" : "gray",
            } as const;

            return (
              <AudioButton key={inx} src={title.file_url ?? ""} {...props} />
            );
          })}
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
