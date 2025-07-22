import { useEffect, useMemo, useState } from "react";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import type { QuestionOption } from "~/api/exam";
import { VideoTitle } from "~/components/question-components";

export function QMES5({
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

  const { videoTitles, optionArrKey } = useQuestionHelper(question);

  useEffect(() => {
    setSelected([]);
  }, [question]);

  useEffect(() => {
    onAnswerChange(selected);
  }, [selected]);

  const conditions = useMemo(() => [selected.length > 0], [selected]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <div className="size-full flex flex-col lg:flex-row items-center justify-evenly">
      <VideoTitle
        titles={videoTitles}
        autoPlay
      />

      <div className="flex flex-wrap items-center justify-center xl:max-w-[800px] md:max-w-[600px] max-w-[550px]">
        {question.options.map((option, inx) => (
          <div
            className="m-4 flex items-center justify-center xl:w-[220px] xl:h-[220px] md:w-[160px] md:h-[160px] w-[120px] h-[90px]"
            key={optionArrKey(option, inx)}
          >
            <OptionButton
              onClick={() => selectItem(option)}
              data-selected={
                !!selected.find((item) => item.position === option.position)
              }
              option={option}
              className="w-full h-full"
            >
              {option.description}
            </OptionButton>
          </div>
        ))}
      </div>
    </div>
  );
}
