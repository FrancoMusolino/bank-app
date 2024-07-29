import { Navigate, Outlet } from "react-router-dom";
import { AppBar, Button, Container, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import { useSession } from "../shared/context/session.context";
import { endSession } from "../shared/context/session.actions";

export const Root = () => {
  const { session, dispatch } = useSession();

  if (!session.token) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ width: "100%", margin: "auto" }}
    >
      <AppBar>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingInline={4}
            paddingBlock={1}
          >
            <Typography
              variant="h6"
              sx={{
                mr: 2,
                fontWeight: 700,
              }}
            >
              {session.firstname} {session.lastname}
            </Typography>

            <Button
              onClick={() => dispatch(endSession())}
              variant="contained"
              sx={{
                background: "gray",
                ":focus": { background: grey[600], outline: "none" },
                ":hover": { background: grey[500] },
              }}
            >
              LOGOUT
            </Button>
          </Stack>
        </Container>
      </AppBar>
      <Outlet />
    </Container>
  );
};
