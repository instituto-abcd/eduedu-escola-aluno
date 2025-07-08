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
      <h1
        className="text-gray-700 mx-auto pb-4"
        style={{ fontSize: boardW(24), paddingBottom: boardW(15) }}
      >
        {title}
      </h1>

      <div className="flex w-full items-center justify-center gap-4">
        {/* Lado esquerdo: texto + imagens */}
        <div className="flex flex-col w-5/12 h-full items-center justify-center">
          <div
            className="w-full pr-7 overflow-y-auto"
            style={{ maxHeight: boardW(450) }}
          >
            <div className="flex flex-col items-center space-y-4">
              <div
                className="text-gray-700 text-center"
                style={{ fontSize: boardW(24) }}
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
                  src={title.file_url}
                  alt={title.file_name}
                  style={{
                    height: boardW(120),
                    width: "auto",
                    paddingTop: boardW(20),
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-5/12 h-full items-center justify-center">
          <div
            className="w-full overflow-y-auto"
            style={{ maxHeight: boardW(450) }}
          >
            <div className="flex flex-col items-center space-y-4">
              <h2
                className="text-gray-700 text-center font-medium"
                style={{ fontSize: boardW(26) }}
              >
                {
                  textTitles.find(
                    (title) =>
                      title.classification ===
                      QuestionTitleClassification.ENUNCIADO
                  )?.description
                }
              </h2>
              <div className="flex flex-wrap justify-center w-4/5 mx-auto gap-4">
                {question.options.map((option) => (
                  <div
                    key={option.description}
                    className="w-5/12 m-2"
                  >
                    <TextOptionButton
                      onClick={() => setAnswer(option)}
                      data-selected={answer?.position === option.position}
                      className="w-full h-auto"
                      style={{ padding: boardW(20) }}
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
      </div>
    </div>
  );
}
