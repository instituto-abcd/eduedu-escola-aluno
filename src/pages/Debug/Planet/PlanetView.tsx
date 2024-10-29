import { Stack } from "@mantine/core";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Planet } from "~/api/student";
import { QuestionLoader } from "~/components/QuestionLoader";
import { QuestionInfo } from "../components/QuestionInfo";
import { QuestionNavigator } from "../components/QuestionNavigator";

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
          bottom: 60,
          left: 20,
          zIndex: 999,
        }}
        id="debugger"
      >
        <QuestionInfo
          question={currentQuestion}
          next={handleAnswer}
          previous={() => (index - 1 <= 0 ? null : setIndex(0))}
          current={index + 1}
          total={planet.questions.length}
          onQuestionChange={(i) => setIndex(i)}
        />
        <QuestionNavigator
          questions={planet.questions}
          current={index}
          onNavigate={(i) => setIndex(i)}
        />
      </Stack>
    </>
  );
}
