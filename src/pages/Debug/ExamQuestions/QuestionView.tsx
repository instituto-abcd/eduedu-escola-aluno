import { Link, Navigate, useLocation } from "react-router-dom";
import { Question } from "~/api/exam";
import { Button } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";

export function QuestionView() {
  const location = useLocation();
  const { question } = location.state as { question: Question };

  if (!question) return <Navigate to="/debug/questions" />;

  return (
    <>
      <Button
        component={Link}
        to="/debug/questions"
        style={{ position: "absolute", top: 50, right: 50 }}
        variant="default"
      >
        Voltar
      </Button>
      <QuestionLoader
        question={question}
        answerCallback={() => null}
      />
    </>
  );
}
