import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "~/components/Layout";
import { PATH } from "~/constants/path";
import { DashboardRoutes } from "./Dashboard";
import { AuthRoutes } from "./Auth";
import { ExamRoutes } from "./ExamRoutes";
import { PlanetRoutes } from "./PlanetRoutes";
import { ExamLayout } from "~/components/ExamLayout/ExamLayout";
import { IntroPage } from "~/pages/Intro/Intro";
import { DebugRoutes } from "./DebugRoutes";
import { useEffect } from "react";

export function AppRoutes() {
  function nested(route: string) {
    return route.endsWith("/") ? route + "*" : `${route}/*`;
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handler);

    return () => {
      document.removeEventListener("contextmenu", handler);
    };
  }, []);

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
        <Route path={nested(PATH.PLANET)} Component={ExamLayout}>
          <Route path="*" Component={PlanetRoutes} />
        </Route>
        <Route path={nested(PATH.LOGIN)} Component={AuthRoutes} />
        <Route path={nested(PATH.INTRO)} Component={IntroPage} />
        <Route path={nested(PATH.DEBUG)} Component={DebugRoutes} />
      </Routes>
    </BrowserRouter>
  );
}
