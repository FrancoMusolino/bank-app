import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../shared/context/session.context";

export const Root = () => {
  const { session } = useSession();

  if (!session.token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!session.accountId) {
    return <Navigate to="/crear-cuenta" replace />;
  }

  return <Outlet />;
};
