import { Route, Routes } from "react-router-dom";
import { PATH } from "~/constants/path";
import { ExamPage } from "~/pages/Exam/Exam";
import { ExamEvaluationPage } from "~/pages/Exam/Exam-Evaluation";

export function ExamRoutes() {
  function nested(route: string) {
    return route.endsWith("/") ? route + "*" : `${route}/*`;
  }
  
  return (
    <Routes>
      <Route index Component={ExamPage} />
      <Route path={nested(PATH.EVALUATION)} Component={ExamEvaluationPage} />
    </Routes>
  );
}
