import { useState } from "react";
import { Link } from "react-router-dom";
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

export const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      await authService.register(data as any);
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
          Registro
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={onRegister}>
          <Box display="flex" gap={2}>
            <TextField
              margin="normal"
              required
              id="firstname"
              type="firstname"
              label="Nombre"
              name="firstname"
              autoFocus
              inputProps={{ maxLength: 255 }}
            />
            <TextField
              margin="normal"
              required
              name="lastname"
              label="Apellido"
              type="lastname"
              id="lastname"
              inputProps={{ maxLength: 255 }}
            />
          </Box>
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
            {isSubmitting ? "Registrando" : "Registrar"}
          </Button>
          <Typography component="span" fontSize={14}>
            Ya tienes cuenta? <Link to="/auth/login">Ingresar</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
