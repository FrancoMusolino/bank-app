import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";

import { Root } from "./root";

// PAGES
import { Login } from "../auth/pages/Login";
import { Register } from "../auth/pages/Register";
import { Home } from "../home/pages/Home";
import { CreateAccount } from "../home/pages/CreateAccount";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ROOT */}
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="crear-cuenta" element={<CreateAccount />} />
      </Route>

      {/* AUTH */}
      <Route path="auth">
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </>
  )
);
