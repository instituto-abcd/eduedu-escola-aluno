import { Question, QuestionTitle } from "~/api/exam"

export type Props = {
    question: Question
    audioTitles: QuestionTitle[],
};
