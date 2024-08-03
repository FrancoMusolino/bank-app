import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { Modal } from "../../shared/components/Modal";
import { TransactionType } from "../services/accounts.service";

export const MakeTransactionModal = () => {
  const onMakeTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Modal trigger={<Button variant="contained">Realizar transacción</Button>}>
      <Typography component="h4" fontSize={20} textAlign="center" mb={4}>
        Realizar transacción
      </Typography>

      <Box
        component="form"
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
        onSubmit={onMakeTransaction}
      >
        <FormControl fullWidth>
          <InputLabel id="type">Tipo</InputLabel>
          <Select id="type" label="Tipo" name="type" required>
            <MenuItem value={TransactionType.DEPOSIT}>Depósito</MenuItem>
            <MenuItem value={TransactionType.WITHDRAWAL}>Retiro</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          fullWidth
          name="amount"
          label="Monto (USD)"
          type="number"
          id="amount"
          required
          inputProps={{ min: 0, step: 0.01 }}
        />

        <Button type="submit" variant="contained">
          Realizar transacción
        </Button>
      </Box>
    </Modal>
  );
};
