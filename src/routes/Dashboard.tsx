import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "~/pages/Dashboard";

export function DashboardRoutes() {
  return (
    <Routes>
      <Route index Component={DashboardPage} />
    </Routes>
  );
}
