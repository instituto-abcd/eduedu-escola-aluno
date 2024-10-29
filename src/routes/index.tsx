import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "~/components/Layout";
import { PATH } from "~/constants/path";
import { DashboardRoutes } from "./Dashboard";
import { AuthRoutes } from "./Auth";
import { ExamRoutes } from "./ExamRoutes";
import { PlanetRoutes } from "./PlanetRoutes";
import { IntroPage } from "~/pages/Intro/Intro";
import { DebugRoutes } from "./DebugRoutes";
import { useEffect } from "react";

export function AppRoutes() {
  function nested(route: string) {
    return route.endsWith("/") ? route + "*" : `${route}/*`;
  }

  useEffect(() => {
    const contextMenuEventHandler = (e: MouseEvent) => {
      e.preventDefault();
    };

    const beforeUnloadEventHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = true;
    };

    document.addEventListener("contextmenu", contextMenuEventHandler);
    document.addEventListener("beforeunload", beforeUnloadEventHandler);

    return () => {
      document.removeEventListener("contextmenu", contextMenuEventHandler);
      document.removeEventListener("beforeunload", beforeUnloadEventHandler);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Layout}>
          <Route index element={<Navigate to={PATH.DASHBOARD} />} />
          <Route path={nested(PATH.DASHBOARD)} Component={DashboardRoutes} />
          <Route path={nested(PATH.EXAM)} Component={ExamRoutes} />
          <Route path={nested(PATH.LOGIN)} Component={AuthRoutes} />
          <Route path={nested(PATH.INTRO)} Component={IntroPage} />
          <Route path={nested(PATH.DEBUG)} Component={DebugRoutes} />
          <Route path={nested(PATH.PLANET)}>
            <Route path="*" Component={PlanetRoutes} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
