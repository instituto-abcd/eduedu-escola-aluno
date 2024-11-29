import { Stack } from "@mantine/core";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Planet } from "~/api/student";
import { QuestionLoader } from "~/components/QuestionLoader";
import { QuestionInfo } from "../components/QuestionInfo";

export function PlanetView() {
  const location = useLocation();
  const planet: Planet = location.state?.planet;

  const [index, setIndex] = useState(0);
  const currentQuestion = planet?.questions[index];

  function handleAnswer() {
    if (index + 1 >= planet.questions.length) {
      alert("Fim do planeta");
      return;
    }

    setIndex(index + 1);
  }

  if (!planet) return <Navigate to=".." />;

  return (
    <>
      {currentQuestion && (
        <QuestionLoader
          question={currentQuestion}
          answerCallback={handleAnswer}
        />
      )}

      <Stack
        style={{
          position: "fixed",
          bottom: 20,
          left: 10,
          zIndex: 999,
        }}
        id="debugger"
      >
        <QuestionInfo
          questions={planet.questions}
          next={handleAnswer}
          previous={() => (index - 1 <= 0 ? null : setIndex(0))}
          current={index + 1}
          total={planet.questions.length}
          onQuestionChange={(i) => setIndex(i)}
        />
      </Stack>
    </>
  );
}
