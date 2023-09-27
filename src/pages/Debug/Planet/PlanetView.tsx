import { Stack } from "@mantine/core";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { QuestionLoader } from "~/components/QuestionLoader";
import { QuestionInfo } from "./components/QuestionInfo";
import { QuestionNavigator } from "./components/QuestionNavigator";
import { Planet } from "~/api/student";

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
      <Stack
        align="center"
        justify="space-between"
        h="100%"
        style={{ position: "relative" }}
      >
        {currentQuestion && (
          <QuestionLoader
            question={currentQuestion}
            answerCallback={handleAnswer}
          />
        )}
      </Stack>

      <Stack style={{ position: "fixed", bottom: 70, left: 30, zIndex: 999 }}>
        <QuestionNavigator
          questions={planet.questions}
          onNavigate={setIndex}
          current={index}
        />
        <QuestionInfo
          question={currentQuestion}
          next={handleAnswer}
          previous={() => (index - 1 <= 0 ? null : setIndex(0))}
        />
      </Stack>
    </>
  );
}
