import { createStyles, Image, Text } from "@mantine/core";
import Lottie from "react-lottie";
import lottieFile from "~/assets/lotties/lottie_speak_up_button.json";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useEffect } from "react";
import { useTimeout } from "@mantine/hooks";
import { AudioContainer } from "~/components/AudioContainer";

const useStyles = createStyles((theme) => {
  return {
    container: {
      img: {
        [`@media (max-width: ${theme.breakpoints.lg})`]: {
          width: "300px !important",
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: "250px !important",
        },
      },
      svg: {
        [`@media (max-width: ${theme.breakpoints.lg})`]: {
          width: "300px !important",
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: "200px !important",
        },
      },
    },
  };
});

export function Model33({ question, onConditionsChange }: ModelProps) {
  const { hasAudioTitle, imageTitles, textTitles } =
    useQuestionHelper(question);
  const illustration = imageTitles[0]?.file_url ?? "";

  const hasTextOrImage =
    !!illustration || textTitles.some((title) => title.file_url);

  const { start } = useTimeout(() => onConditionsChange([]), 1000);
  const { classes } = useStyles();

  useEffect(() => {
    start();
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <AudioContainer
          question={question}
          hasPrimaryIcon={false}
        />
      )}

      <div className="flex flex-col gap-4 md:flex-row items-center justify-center md:justify-evenly w-full mt-auto">
        {hasTextOrImage && (
          <div className="">
            {illustration && (
              <Image
                src={illustration}
                className={classes.container}
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
          </div>
        )}

        <div className={classes.container}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: lottieFile,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
