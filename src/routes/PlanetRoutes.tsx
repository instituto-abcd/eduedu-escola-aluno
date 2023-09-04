import { Route, Routes } from "react-router-dom";
import { PlanetPage } from "~/pages/Planet";
import { PlanetFeedbackPage } from "~/pages/Planet/PlanetFeedback";

export function PlanetRoutes() {
  return (
    <Routes>
      <Route path=":planetId" Component={PlanetPage} />
      <Route path="feedback" Component={PlanetFeedbackPage} />
    </Routes>
  );
}
