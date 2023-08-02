import { Question } from "~/api/exam";

export type ModelProps = {
  question: Question;
  onAnswer: (answer: string, isCorrect: boolean) => void;
};
