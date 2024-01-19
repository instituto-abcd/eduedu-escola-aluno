import { ReactNode } from "react";
import { Question, QuestionTitle } from "~/api/exam"

export type Props = {
    question: Question,
    audioTitles: QuestionTitle[],
    hasPrimaryIcon?: boolean,
    children?: ReactNode
};
