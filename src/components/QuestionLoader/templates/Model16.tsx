import { Group } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import Lottie from "react-lottie";
import { useEffect, useState } from "react";

export function Model16({ question, answerCallback }: ModelProps) {
  const { audioTitles, lottieTitles, getLottieJson } =
    useQuestionHelper(question);
  const [lottieJson, setLottieJson] = useState<string>();

  useEffect(() => {
    if (lottieTitles) {
      void (async () => {
        const json = await getLottieJson(lottieTitles[0].file_url!);
        if (json) {
          setLottieJson(JSON.stringify(json));
        }
      })();
    }
  }, []);

  return (
    <>
      {audioTitles.filter((title) => title.file_url).length > 0 && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={inx}
                src={title.file_url!}
                autoPlay={inx === 0}
              />
            ))}
        </Group>
      )}

      <Group position="apart" spacing={137}>
        {lottieJson && (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: lottieJson,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={400}
            width={400}
          />
        )}
      </Group>
    </>
  );
}
