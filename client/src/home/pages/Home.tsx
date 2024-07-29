import React from "react";
import { Navigate } from "react-router-dom";

import { useSession } from "../../shared/context/session.context";

export const Home = () => {
  const { session } = useSession();

  if (!session.accountId) {
    return <Navigate to="/crear-cuenta" replace />;
  }

  return <div>Home</div>;
};
