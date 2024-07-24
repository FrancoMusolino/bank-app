import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";
import { SessionProvider } from "./shared/context/session.context";

export function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />;
    </SessionProvider>
  );
}
