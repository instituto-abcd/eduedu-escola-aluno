import { Question, QuestionOption } from "~/api/exam";

export type ModelProps = {
  question: Question;
  auxQuestion?: Question;
  onAnswerChange: (answer: QuestionOption[]) => void;
  setContinueDisabled: (disabled: boolean) => void;
};
