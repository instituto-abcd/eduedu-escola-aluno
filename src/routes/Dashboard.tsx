import { Navigate, Route, Routes } from "react-router-dom";
import { PATH } from "~/constants/path";
import { DashboardPage } from "~/pages/Dashboard";
import { useStudent } from "~/stores/student";

export function DashboardRoutes() {
  const isAuthenticated = useStudent((s) => s.valid());
  if (!isAuthenticated) return <Navigate to={PATH.LOGIN} />;

  return (
    <Routes>
      <Route index Component={DashboardPage} />
    </Routes>
  );
}
