import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";

export const Register = () => {
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
        <Box
          component="form"
          sx={{ mt: 1 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Box display="flex" gap={2}>
            <TextField
              margin="normal"
              required
              id="firstname"
              type="firstname"
              label="Nombre"
              name="firstname"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              name="lastname"
              label="Apellido"
              type="lastname"
              id="lastname"
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
          >
            Registrar
          </Button>
          <Typography component="span" fontSize={14}>
            Ya tienes cuenta? <Link to="/auth/login">Ingresar</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
