import React, { useState } from "react";
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
import toast from "react-hot-toast";

import { Modal } from "../../shared/components/Modal";
import { accountsService, TransactionType } from "../services/accounts.service";
import { Cents } from "../../shared/utils/cents";
import { useSession } from "../../shared/context/session.context";

export const MakeTransactionModal = () => {
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onMakeTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      await accountsService.makeTransaction(
        {
          type: data.type.toString() as TransactionType,
          amount: Cents.fromString(data.amount.toString()),
        },
        session.token
      );

      toast.success("Transacción exitosa");
      return { success: true };
    } catch (error: unknown) {
      toast.error(error as string);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal trigger={<Button variant="contained">Realizar transacción</Button>}>
      {({ handleClose }) => (
        <>
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
            onSubmit={(e) => {
              onMakeTransaction(e).then((res) => res.success && handleClose());
            }}
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

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Procesando" : "Realizar transacción"}
            </Button>
          </Box>
        </>
      )}
    </Modal>
  );
};
