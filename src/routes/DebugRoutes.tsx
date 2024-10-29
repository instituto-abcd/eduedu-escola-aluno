import { Route, Routes } from "react-router-dom";
import { DebugPage } from "~/pages/Debug/Debug";
import { QuestionListPage } from "~/pages/Debug/ExamQuestions/QuestionList";
import { QuestionView } from "~/pages/Debug/ExamQuestions/QuestionView";
import { ModelsList } from "~/pages/Debug/Models/ModelList";
import { ModelView } from "~/pages/Debug/Models/ModelView";
import { PlanetList } from "~/pages/Debug/Planet/PlanetList";
import { PlanetView } from "~/pages/Debug/Planet/PlanetView";
import { SchoolClassSelect } from "~/pages/Debug/Test/SchoolClassSelect";
import { SchoolYearSelect } from "~/pages/Debug/Test/SchoolYearSelect";

export function DebugRoutes() {
  return (
    <Routes>
      <Route index Component={DebugPage} />
      <Route path="planet" Component={PlanetList} />
      <Route path="planet/:planetId" Component={PlanetView} />
      <Route path="questions" Component={QuestionListPage} />
      <Route path="questions/:questionId" Component={QuestionView} />
      <Route path="model" Component={ModelsList} />
      <Route path="model/:modelId" Component={ModelView} />
      <Route path="test/school-year-select" Component={SchoolYearSelect} />
      <Route path="test/school-class-select" Component={SchoolClassSelect} />
    </Routes>
  );
}
