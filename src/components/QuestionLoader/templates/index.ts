import { Question } from "~/api/exam";

export type ModelProps = {
  question: Question;
  answerCallback: (nextQuestion: Question | { examCompleted: true }) => void;
};
