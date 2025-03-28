import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { useEffect, useMemo, useState } from "react";
import { ImageTitle } from "~/components/question-components";
import { CardManual } from "~/components/question-components/card-manual";
import { AudioContainer } from "~/components/AudioContainer";
import { TextTitle } from "~/components/question-components/TextTitle";

export function Model22({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { textTitles, imageTitles } = useQuestionHelper(question);

  const [answer, setAnswer] = useState<QuestionOption>();

  function handleAnswer(option: QuestionOption) {
    if (JSON.stringify(answer) === JSON.stringify(option)) {
      setAnswer(undefined);
    } else {
      setAnswer(option);
    }
  }

  useEffect(() => {
    setAnswer(undefined);
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
          {question.options
            .sort((a, b) => +a.position - +b.position)
            .map((option, inx) => (
              <CardManual
                key={inx}
                selected={option.description === answer?.description}
                text={option.description}
                onClick={() => handleAnswer(option)}
                shape="pill"
              />
            ))}
        </div>
      </div>
    </>
  );
}
