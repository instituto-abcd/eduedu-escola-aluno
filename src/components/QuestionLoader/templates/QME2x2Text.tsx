import { useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function QME2x2Text({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { textTitles, imageTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

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

  const title = "Leia o texto e responda à pergunta.";

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <h1 className="text-gray-700 font-bold md:text-2xl text-xl pb-4">
        {title}
      </h1>

      <div className="flex flex-col lg:flex-row w-full h-full items-center justify-evenly">
        <div className="flex flex-col w-full lg:w-1/2 h-1/2 lg:h-full items-center justify-center space-y-4 p-4 md:p-8">
          <span
            className="text-gray-700 md:text-2xl text-xl text-center"
            dangerouslySetInnerHTML={{
              __html:
                textTitles.find(
                  (title) =>
                    title.classification ===
                    QuestionTitleClassification.HISTORIA
                )?.description ?? "",
            }}
          />
          {imageTitles.map((title) => (
            <img
              key={title.file_url}
              src={title.file_url || ""}
              alt={title.file_name}
              className="w-[100px] md:w-[150px] object-cover"
            />
          ))}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-gray-700 text-center font-semibold md:text-2xl text-xl">
            {
              textTitles.find(
                (title) =>
                  title.classification === QuestionTitleClassification.ENUNCIADO
              )?.description
            }
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option) => (
              <div
                key={option.description}
                className="flex items-center justify-center xl:w-[300px] xl:h-[300px] md:w-[180px] md:h-[180px] w-[120px] h-[120px]"
              >
                <TextOptionButton
                  onClick={() => setAnswer(option)}
                  data-selected={answer?.position === option.position}
                  className="w-full h-full xl:text-2xl md:text-xl text-md p-2"
                  option={option}
                  debug={{ size: 10 }}
                >
                  {option.description}
                </TextOptionButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
