import { Route, Routes } from "react-router-dom";
import { ExamLayout } from "~/components/ExamLayout/ExamLayout";
import { QuestionListPage } from "~/pages/Debug/ExamQuestions/QuestionList";
import { QuestionView } from "~/pages/Debug/ExamQuestions/QuestionView";
import { PlanetList } from "~/pages/Debug/Planet/PlanetList";
import { PlanetView } from "~/pages/Debug/Planet/PlanetView";

export function DebugRoutes() {
  return (
    <Routes>
      <Route path="planet" Component={PlanetList} />
      <Route path="planet/:planetId" Component={ExamLayout}>
        <Route index Component={PlanetView} />
      </Route>
      <Route path="questions" Component={QuestionListPage} />
      <Route path="questions/:questionId" Component={ExamLayout}>
        <Route index Component={QuestionView} />
      </Route>
    </Routes>
  );
}
