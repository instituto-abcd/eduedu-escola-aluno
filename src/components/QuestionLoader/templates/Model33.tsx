import Lottie from "react-lottie";
import lottieFile from "~/assets/lotties/lottie_speak_up_button.json";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useEffect } from "react";
import { AudioContainer } from "~/components/AudioContainer";

export function Model33({ question, onConditionsChange }: ModelProps) {
  const { hasAudioTitle, imageTitles, textTitles } =
    useQuestionHelper(question);
  const illustration = imageTitles[0]?.file_url ?? "";

  const hasTextOrImage =
    !!illustration || textTitles.some((title) => title.file_url);

  useEffect(() => {
    const timer = setTimeout(() => {
      onConditionsChange([]);
    }, 1000);

    return () => clearTimeout(timer);
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
          <div className="flex flex-col items-center">
            {illustration && (
              <img
                src={illustration}
                alt="Ilustração"
                className="
                  w-[419px] 
                  lg:w-[419px] 
                  sm:w-[336px] 
                  mb-4
                  "
                style={{ maxWidth: "100%" }}
              />
            )}

            {textTitles.map((title) => (
              <p
                key={title.description}
                className="text-[50px] text-gray-700 font-medium text-center"
              >
                {title.description}
              </p>
            ))}
          </div>
        )}

        <div className="w-[200px] lg:w-[200px] sm:w-[200px]">
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
