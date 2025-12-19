import { IconVolume } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import type { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import { TextTitle } from "~/components/question-components/TextTitle";
import { ImageTitle, VideoTitle } from "~/components/question-components";

const showTextOptionExceptions = [35, 36, 79, 80, 87, 88];

export function Model8Prova({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { audioTitles, textTitles, imageTitles, videoTitles, hasAudioTitle } =
    useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const showAudioIndicatorOnly = !showTextOptionExceptions.includes(
    question.id
  );

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      {hasAudioTitle &&
        audioTitles.map((title, inx) => (
          <AudioButton
            index={inx}
            key={inx}
            src={title.file_url ?? ""}
            autoPlay
          />
        ))}

      <div className="flex flex-col lg:flex-row size-full items-center justify-evenly">
        <div className="flex flex-col items-center gap-4 md:max-w-[50%]">
          {textTitles.map((title, inx) => (
            <span
              key={inx}
              className="text-gray-700 md:text-2xl text-xl text-center"
            >
              {title.description}
            </span>
          ))}

          <img
            src={imageTitles[0]?.file_url ?? ""}
            alt={imageTitles[0]?.description}
            className="w-full object-cover"
          />

          <VideoTitle
            titles={videoTitles}
            autoPlay
            className="max-w-[400px] lg:max-w-[600px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {showAudioIndicatorOnly &&
            question.options.map((option, inx) => (
              <div
                key={inx}
                className="flex items-center justify-center xl:w-[220px] xl:h-[220px] md:w-[200px] md:h-[200px] w-[120px] h-[120px]"
              >
                <OptionButton
                  onClick={() => setAnswer(option)}
                  data-selected={answer?.position === option.position}
                  option={option}
                  debug={{ size: 12 }}
                  className="w-full h-full"
                >
                  <IconVolume />
                  <p className="text-text font-black text-xl">{inx + 1}</p>
                </OptionButton>
              </div>
            ))}

          {!showAudioIndicatorOnly &&
            question.options.map((option, inx) => (
              <div
                key={option.description}
                className="flex items-center justify-center xl:w-[300px] xl:h-[300px] md:w-[180px] md:h-[180px] w-[120px] h-[120px]"
              >
                <TextOptionButton
                  key={inx}
                  onClick={() => setAnswer(option)}
                  data-selected={answer?.position === option.position}
                  option={option}
                  debug={{ size: 12 }}
                  className="w-full h-full xl:text-2xl md:text-xl text-md p-2"
                >
                  {option.description}
                </TextOptionButton>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
