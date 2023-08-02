import { Route, Routes } from "react-router-dom";
import { ExamPage } from "~/pages/Exam/Exam";

export function ExamRoutes() {
  return (
    <Routes>
      <Route index Component={ExamPage} />
    </Routes>
  );
}
