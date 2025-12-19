import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { VideoTitle } from "~/components/question-components";

export function QME2x3Video({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [selected, setSelected] = useState<QuestionOption[]>([]);

  function selectItem(answer: QuestionOption) {
    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          ...answer,
          positionAnswer: answer.position,
        } as QuestionOption,
      ]);
    }
  }

  useEffect(() => {
    setSelected([]);
  }, [question]);

  const { videoTitles, optionArrKey } = useQuestionHelper(question);

  useEffect(() => {
    onAnswerChange(selected);
  }, [selected]);

  const conditions = useMemo(() => [selected.length > 0], [selected]);

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

      <div className="grid grid-cols-3 gap-4">
        {question.options.map((option, inx) => (
          <div
            className="flex items-center justify-center xl:w-[220px] xl:h-[220px]  md:w-[150px] md:h-[150px] w-[100px] h-[100px]"
            key={optionArrKey(option, inx)}
          >
            <OptionButton
              data-selected={
                !!selected.find((item) => item.position === option.position)
              }
              onClick={() => selectItem(option)}
              option={option}
              className="w-full h-full"
            >
              {option.image_url ? (
                <img
                  src={option.image_url}
                  alt={option.description}
                  className="w-full"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                option.description && (
                  <p className="text-gray-800">{option.description}</p>
                )
              )}
            </OptionButton>
          </div>
        ))}
      </div>
    </div>
  );
}
