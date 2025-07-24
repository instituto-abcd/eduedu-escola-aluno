import { IconVolume } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { VideoTitle } from "~/components/question-components";
import type { ModelProps } from ".";
import type { QuestionOption } from "~/api/exam";

export function QME2x2Video({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { videoTitles } = useQuestionHelper(question);

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
    <div className="size-full flex flex-col lg:flex-row items-center justify-evenly p-4">
      <VideoTitle
        titles={videoTitles}
        autoPlay
        className="max-w-[400px] lg:max-w-[600px]"
      />

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option) => (
          <div
            className="flex items-center justify-center xl:w-[220px] xl:h-[220px] md:w-[200px] md:h-[200px] w-[120px] h-[120px]"
            key={option.position}
          >
            <OptionButton
              data-selected={JSON.stringify(answer) === JSON.stringify(option)}
              onClick={() => setAnswer(option)}
              option={option}
              className="w-full h-full"
            >
              {option.image_url && (
                <img
                  src={option.image_url}
                  alt={option.description}
                  className="w-full object-cover"
                />
              )}
              {!option.image_url && option.sound_url && (
                <IconVolume size={80} />
              )}
              {!option.image_url && !option.sound_url && option.description && (
                <p className="text-text font-black">{option.description}</p>
              )}
            </OptionButton>
          </div>
        ))}
      </div>
    </div>
  );
}
