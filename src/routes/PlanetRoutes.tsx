import { Route, Routes } from "react-router-dom";
import { PlanetPage } from "~/pages/Planet";

export function PlanetRoutes() {
  return (
    <Routes>
      <Route path=":planetId" Component={PlanetPage} />
    </Routes>
  );
}
