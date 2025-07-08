import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

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

  const spacingVh = (lousaHeight * 0.5) / 100;

  return (
    <div
      className="flex flex-nowrap my-auto pt-0"
      style={{
        minWidth: "70%",
        paddingTop: `${spacingVh}vh`,
        gap: `${spacingVh}vh`,
      }}
    >
      <div style={{ maxWidth: `${(lousaWidth * 50) / 100}px`, flexGrow: 1 }}>
        <VideoPlayer
          src={videoTitles[0]?.file_url ?? ""}
          autoPlay
        />
      </div>

      <div
        style={{ maxWidth: `${(lousaWidth * 50) / 100}px`, minWidth: "30%" }}
      >
        <div
          className="grid grid-cols-2 gap-5"
          style={{ gap: "20px" }}
        >
          {question.options.map((option, inx) => (
            <OptionButton
              key={optionArrKey(option, inx)}
              data-selected={
                !!selected.find((item) => item.position === option.position)
              }
              onClick={() => selectItem(option)}
              option={option}
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
          ))}
        </div>
      </div>
    </div>
  );
}
