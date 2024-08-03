import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Box, Button, TextField, Typography } from "@mui/material";

import { accountsService } from "../services/accounts.service";
import { useSession } from "../../shared/context/session.context";
import { setAccount } from "../../shared/context/session.actions";

export const CreateAccount = () => {
  const navigate = useNavigate();
  const { dispatch, session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const res = await accountsService.createAccount(
        {
          name: data.name as string,
          balance: data.balance ? Number(data.balance) * 100 : undefined,
          number: Number(data.number),
        },
        session.token
      );

      dispatch(setAccount({ accountId: res.accountId }));
      toast.success("Cuenta creada exitosamente");
      return navigate("/", { replace: true });
    } catch (error) {
      return toast.error(error as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Crear cuenta
      </Typography>
      <Typography component="p" textAlign="center" fontSize={14}>
        Debes crear una cuenta para poder realizar transacciones
      </Typography>
      <Box component="form" sx={{ mt: 1 }} onSubmit={onCreateAccount}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          type="text"
          label="Nombre"
          name="name"
          autoFocus
          inputProps={{ maxLength: 255 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="number"
          label="Número"
          type="number"
          id="number"
          inputProps={{ min: 1 }}
        />
        <TextField
          margin="normal"
          fullWidth
          name="balance"
          label="Balance (USD)"
          type="number"
          id="balance"
          inputProps={{ min: 0, step: 0.01 }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            width: "30%",
            display: "flex",
            marginInline: "auto",
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando" : "Crear"}
        </Button>
      </Box>
    </Box>
  );
};
