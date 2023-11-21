import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDebugModelQuestions } from "~/api/debug";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { QuestionInfo } from "../components/QuestionInfo";
import { QuestionLoader } from "~/components/QuestionLoader";
import { ModelProgress } from "../components/ModelProgress";

export function ModelView() {
  const { modelId } = useParams();
  const [query, setQuery] = useSearchParams();
  const searchIndex = query.get("index");

  const [currentQuestion, setCurrentQuestion] = useState(-1);
  //   function logRule(questions: Question[]) {
  //     const currentRule = "fill";
  // 
  //     const allRules = questions
  //       .map((question, inx) =>
  //         question.rules?.length > 0
  //           ? {
  //             questionId: question.id,
  //             planetTitle: question.planetTitle,
  //             planetId: question.planet_id,
  //             rules: question.rules,
  //             // questionIndex: inx
  //           }
  //           : undefined
  //       )
  //       .filter(Boolean) as {
  //         rules: Question["rules"];
  //         questionIndex: number;
  //       }[];
  // 
  //     const rulesWithAuxAutoPlay = allRules.filter((rule) =>
  //       rule.rules.some(
  //         (rule) => rule.name === currentRule && rule.value === "true"
  //       )
  //     );
  // 
  //     console.log(`RULES: ${currentRule}`, rulesWithAuxAutoPlay);
  //   }
  const { data, isFetching } = useDebugModelQuestions(modelId ?? "", {
    enabled: !!modelId,
    initialData: [],
    onSuccess: (data) => {
      if (data.length > 0) {
        // logRule(data)

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
        h="100%"
        w="100%"
        align="center"
        spacing={boardW(40)}
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
