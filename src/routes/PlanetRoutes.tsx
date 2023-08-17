import { Route, Routes } from "react-router-dom";
import { PlanetPage } from "~/pages/Planet/Exam";

export function PlanetRoutes() {
  return (
    <Routes>
      <Route index Component={PlanetPage} />
    </Routes>
  );
}
