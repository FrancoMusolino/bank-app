import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";
import { SessionProvider } from "./shared/context/session.context";
import { Toaster } from "react-hot-toast";

export function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />;
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
