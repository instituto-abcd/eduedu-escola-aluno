import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImageTitle } from "~/components/question-components";
import { CardManual } from "~/components/question-components/card-manual";
import { AudioContainer } from "~/components/AudioContainer";
import { TextTitle } from "~/components/question-components/TextTitle";

type SelectedOption = { index: number; description: string };

export function Model22({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { textTitles, imageTitles } = useQuestionHelper(question);

  const [selected, setSelected] = useState<SelectedOption[]>([]);
  const optionsRef = useRef<QuestionOption[]>([]);

  function isOptionSelected(index: number, description: string) {
    return selected.some(
      (sel) => sel.index === index && sel.description === description
    );
  }

  function handleAnswer(option: QuestionOption, index: number) {
    const alreadySelected = isOptionSelected(index, option.description);

    const newSelected = alreadySelected
      ? selected.filter(
          (sel) =>
            !(sel.index === index && sel.description === option.description)
        )
      : [...selected, { index, description: option.description }];

    setSelected(newSelected);
  }

  useEffect(() => {
    setSelected([]);
    optionsRef.current = question.options.sort(
      (a, b) => +a.position - +b.position
    );
  }, [question]);

  useEffect(() => {
    const selectedOptions = selected.map(
      (sel) => optionsRef.current[sel.index]
    );
    onAnswerChange(selectedOptions);
  }, [selected]);

  const conditions = useMemo(() => [selected.length > 0], [selected]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      <AudioContainer question={question} />

      <div className="size-full flex flex-col items-center justify-evenly">
        {textTitles.map((title, inx) => (
          <TextTitle
            text={title.description}
            key={inx}
          />
        ))}

        <ImageTitle titles={imageTitles} />

        <div className="w-full h-auto flex flex-wrap items-center justify-center gap-4 px-10 max-w-4xl">
          {optionsRef.current.map((option, inx) => (
            <CardManual
              key={inx}
              selected={isOptionSelected(inx, option.description)}
              text={option.description}
              onClick={() => handleAnswer(option, inx)}
              shape="pill"
            />
          ))}
        </div>
      </div>
    </>
  );
}
