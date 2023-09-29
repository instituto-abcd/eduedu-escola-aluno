import { Link, useParams } from "react-router-dom";
import { QuestionInfo } from "../Planet/components/QuestionInfo";
import { Button, LoadingOverlay, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useDebugModelQuestions } from "~/api/debug";
import { useState } from "react";
import { lousaHeight } from "~/constants/dimensions";

export function ModelView() {
  const { modelId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(-1);

  const { data, isFetching } = useDebugModelQuestions(modelId ?? "", {
    enabled: !!modelId,
    initialData: [],
    onSuccess: (data) => {
      if (data.length > 0) {
        setCurrentQuestion(0);
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

  return (
    <>
      <Stack
        spacing={55}
        align="center"
        h="100%"
        w="100%"
        px={54}
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
        to="/debug/questions"
        style={{ position: "absolute", top: 50, right: 50 }}
        variant="default"
      >
        Voltar
      </Button>

      {currentQuestion !== -1 && data?.[currentQuestion] && (
        <Stack style={{ position: "fixed", bottom: 70, left: 30, zIndex: 999 }}>
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
