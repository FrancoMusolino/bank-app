import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import { Root } from "./root";
import { Login } from "../auth/pages/Login";
import { Register } from "../auth/pages/Register";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ROOT */}
      <Route path="/" element={<Root />}>
        <Route index element={<h1>Home</h1>} />
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
