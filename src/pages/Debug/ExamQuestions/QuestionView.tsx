import { Question } from "~/api/exam";
import { Link, Navigate, useLocation } from "react-router-dom";
import { QuestionInfo } from "../components/QuestionInfo";
import { Button, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";

export function QuestionView() {
  const location = useLocation();
  const { question } = location.state as { question: Question };

  if (!question) return <Navigate to="/debug/questions" />;

  return (
    <>
      <Stack h="100%" w="100%" style={{ position: "relative" }}>
        {question && (
          <QuestionLoader question={question} answerCallback={() => null} />
        )}
      </Stack>
      <Button
        component={Link}
        to="/debug/questions"
        style={{ position: "absolute", top: 50, right: 50 }}
        variant="default"
      >
        Voltar
      </Button>
      <Stack style={{ position: "fixed", bottom: 70, left: 30, zIndex: 999 }}>
        <QuestionInfo
          question={question}
          next={() => {
            return;
          }}
          previous={() => {
            return;
          }}
        />
      </Stack>
    </>
  );
}
