import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDebugModelQuestions } from "~/api/debug";
import { QuestionInfo } from "../components/QuestionInfo";
import { QuestionLoader } from "~/components/QuestionLoader";

export function ModelView() {
  const { modelId } = useParams();
  const [query, setQuery] = useSearchParams();
  const searchIndex = query.get("index");

  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const { data } = useDebugModelQuestions(modelId ?? "", {
    enabled: !!modelId,
    initialData: [],
    onSuccess: (data) => {
      if (data.length > 0) {
        if (
          searchIndex === null ||
          !Number.isInteger(+searchIndex) ||
          +searchIndex < 0 ||
          +searchIndex >= data.length
        ) {
          return setCurrentQuestion(0);
        } else {
          return setCurrentQuestion(parseInt(searchIndex));
        }
      }
    },
  });

  function handleNextQuestion() {
    if (!data) return;
    if (currentQuestion + 1 < data.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  function handlePreviousQuestion() {
    if (!data) return;
    if (currentQuestion - 1 >= 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  useEffect(() => {
    if (currentQuestion === -1) return;
    setQuery((prev) => {
      prev.set("index", currentQuestion.toString());
      return prev;
    });
  }, [currentQuestion]);

  return (
    <>
      {currentQuestion !== -1 && data?.[currentQuestion] && (
        <QuestionLoader
          question={data[currentQuestion]}
          answerCallback={() => null}
        />
      )}

      {currentQuestion !== -1 && data?.[currentQuestion] && (
        <div
          className="flex flex-col"
          style={{
            position: "fixed",
            bottom: 20,
            left: 10,
            zIndex: 999,
          }}
          id="debugger"
        >
          <QuestionInfo
            questions={data}
            next={handleNextQuestion}
            previous={handlePreviousQuestion}
            current={currentQuestion}
            total={data.length}
            onQuestionChange={setCurrentQuestion}
          />
        </div>
      )}
    </>
  );
}
