import { Navigate, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { useSession } from "../shared/context/session.context";
import { endSession } from "../shared/context/session.actions";

export const Root = () => {
  const { session, dispatch } = useSession();

  if (!session.token) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      <AppBar sx={{ maxWidth: "1400px", margin: "0 auto" }}>
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
      <Container
        component="main"
        maxWidth="lg"
        style={{ width: "100%", margin: "auto", marginTop: "6rem" }}
      >
        <Outlet />
      </Container>
    </>
  );
};
