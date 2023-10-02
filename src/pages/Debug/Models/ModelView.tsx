import { Link, useParams, useSearchParams } from "react-router-dom";
import { QuestionInfo } from "../components/QuestionInfo";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useDebugModelQuestions } from "~/api/debug";
import { useEffect, useState } from "react";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";
import { ModelProgress } from "../components/ModelProgress";

export function ModelView() {
  const { modelId } = useParams();
  const [query, setQuery] = useSearchParams();
  const searchIndex = query.get("index");

  const [currentQuestion, setCurrentQuestion] = useState(-1);

  const { data, isFetching } = useDebugModelQuestions(modelId ?? "", {
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
      <Stack
        spacing={lousaWidth * 0.055}
        align="center"
        h="100%"
        w="100%"
        style={{ position: "relative" }}
      >
        {currentQuestion !== -1 && data?.[currentQuestion] && (
          <QuestionLoader
            question={data[currentQuestion]}
            answerCallback={() => null}
          />
        )}

        <LoadingOverlay
          visible={isFetching}
          style={{ maxHeight: (lousaHeight * 80) / 100 }}
        />
      </Stack>
      <Button
        component={Link}
        to="/debug/model"
        style={{ position: "absolute", top: 50, right: 50 }}
        variant="default"
      >
        Voltar
      </Button>

      {currentQuestion !== -1 && data?.[currentQuestion] && (
        <Stack style={{ position: "fixed", bottom: 70, left: 30, zIndex: 999 }}>
          <ModelProgress
            current={currentQuestion}
            total={data.length}
            question={data[currentQuestion]}
            onQuestionChange={setCurrentQuestion}
          />
          <QuestionInfo
            question={data[currentQuestion]}
            next={handleNextQuestion}
            previous={handlePreviousQuestion}
          />
        </Stack>
      )}
    </>
  );
}
