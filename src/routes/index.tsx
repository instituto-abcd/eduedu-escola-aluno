import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "~/components/Layout";
import { PATH } from "~/constants/path";
import { DashboardRoutes } from "./Dashboard";
import { AuthRoutes } from "./Auth";
import { ExamRoutes } from "./ExamRoutes";
import { ExamLayout } from "~/components/ExamLayout/ExamLayout";

export function AppRoutes() {
  function nested(route: string) {
    return route.endsWith("/") ? route + "*" : `${route}/*`;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Layout}>
          <Route index element={<Navigate to={PATH.DASHBOARD} />} />
          <Route path={nested(PATH.DASHBOARD)} Component={DashboardRoutes} />
          <Route path={nested(PATH.EXAM)} Component={ExamRoutes} />
        </Route>
        <Route path={nested(PATH.EXAM)} Component={ExamLayout}>
          <Route index Component={ExamRoutes} />
        </Route>
        <Route path={nested(PATH.LOGIN)} Component={AuthRoutes} />
      </Routes>
    </BrowserRouter>
  );
}
