import { useCallback, useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { Model24TypeComplete } from "~/components/Model24/TypeComplete";
import { Model24TypeSelect } from "~/components/Model24/TypeSelect";

export function Model24({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { textTitles, imageTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<number>(-1);

  const varExeptions = ["Texto para completar, exp: a menina perdeu a ____"];
  const isTypeComplete = textTitles
    .filter((title) => !varExeptions.includes(title.placeholder))
    .some((title) => title.placeholder.includes("completar"));

  const isTypeSelect = !isTypeComplete;
  const [singleAnswer, setSingleAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(-1);
    setSingleAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(isTypeSelect ? [singleAnswer as QuestionOption] : []);
  }, [answer, singleAnswer]);

  const conditions = useMemo(
    () => [isTypeSelect ? !!singleAnswer : answer !== -1],
    [answer, singleAnswer]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const getDashesAccordingAnswer = useCallback(() => {
    const length = question.options.find((option) => option.isCorrect)
      ?.description?.length;
    return Array.prototype.join.call({ length: (length || -1) + 1 }, "_");
  }, [question]);

  const singleAnswerWithUnderlineDashes = useMemo(
    () =>
      singleAnswer?.description
        ? `<span style="text-decoration: underline;">${singleAnswer?.description}</span>`
        : getDashesAccordingAnswer(),
    [question, singleAnswer]
  );

  return (
    <>
      <AudioContainer
        question={question}
        hasPrimaryIcon={false}
      />

      <div className={`flex flex-col gap-[${boardW(40)}px] w-full my-auto`}>
        {isTypeComplete && (
          <Model24TypeComplete
            textTitles={textTitles}
            imageTitles={imageTitles}
            question={question}
            answer={answer}
            setAnswer={setAnswer}
          />
        )}

        {isTypeSelect && (
          <Model24TypeSelect
            textTitles={textTitles}
            imageTitles={imageTitles}
            question={question}
            singleAnswer={singleAnswer}
            setSingleAnswer={setSingleAnswer}
            dashes={
              singleAnswerWithUnderlineDashes || getDashesAccordingAnswer()
            }
          />
        )}
      </div>
    </>
  );
}
