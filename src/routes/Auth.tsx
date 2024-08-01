import { Route, Routes } from "react-router-dom";
import { LoginPage } from "~/pages/Login/Login";
import { LoginPage as NewLoginPage } from "~/pages/Login/new/Login";

export function AuthRoutes() {
  return (
    <Routes>
      <Route index Component={LoginPage} />
      <Route path="new">
        <Route index Component={NewLoginPage} />
      </Route>
    </Routes>
  );
}
