import { Route, Routes } from "react-router-dom";
import { ExamLayout } from "~/components/ExamLayout/ExamLayout";
import { QuestionListPage } from "~/pages/Debug/ExamQuestions/QuestionList";
import { QuestionView } from "~/pages/Debug/ExamQuestions/QuestionView";
import { ModelsList } from "~/pages/Debug/Models/ModelList";
import { ModelView } from "~/pages/Debug/Models/ModelView";
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
      <Route path="model" Component={ModelsList} />
      <Route path="model/:modelId" Component={ExamLayout}>
        <Route index Component={ModelView} />
      </Route>
    </Routes>
  );
}
