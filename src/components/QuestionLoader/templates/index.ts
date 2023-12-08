import { Question, QuestionOption } from "~/api/exam";

export type ModelProps = {
  question: Question;
  auxQuestion?: Question;
  onAnswerChange: (answer: QuestionOption[]) => void;
  onConditionsChange: (conditions: boolean[]) => void;
};
