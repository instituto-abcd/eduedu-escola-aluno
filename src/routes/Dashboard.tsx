import { Navigate, Route, Routes } from "react-router-dom";
import { PATH } from "~/constants/path";
import { DashboardPage } from "~/pages/Dashboard";
import { useUserStore } from "~/stores/user";

export function DashboardRoutes() {
  const isAuthenticated = useUserStore((u) => u.isUserAuthenticated());

  if (!isAuthenticated) return <Navigate to={PATH.LOGIN} />;

  return (
    <Routes>
      <Route index Component={DashboardPage} />
    </Routes>
  );
}
