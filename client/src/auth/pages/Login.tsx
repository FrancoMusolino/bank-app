import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { authService } from "../services/auth.service";
import { useSession } from "../../shared/context/session.context";
import { startSession } from "../../shared/context/session.actions";

export const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const res = await authService.login(data as any);

      dispatch(startSession({ ...res, accountId: null }));
      return navigate("/", { replace: true });
    } catch (error: unknown) {
      return toast.error(error as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ width: "100%", margin: "auto" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={onLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            type="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando" : "Ingresar"}
          </Button>
          <Typography component="span" fontSize={14}>
            No tienes cuenta? <Link to="/auth/register">Regístrate</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
