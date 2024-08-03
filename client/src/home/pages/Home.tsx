import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

import { useSession } from "../../shared/context/session.context";
import { accountsService, GetAccountRes } from "../services/accounts.service";
import { formatMoney } from "../../shared/utils";
import { TransactionsTable } from "../components/TransactionsTable";
import { MakeTransactionModal } from "../components/MakeTransactionModal";

export const Home = () => {
  const { session } = useSession();
  const [accountInfo, setAccountInfo] = useState<GetAccountRes | null>(null);

  useEffect(() => {
    const getAccountInfo = async (accountId: string) => {
      const accountInfo = await accountsService.getAccount(
        accountId,
        session.token
      );

      setAccountInfo(accountInfo);
    };

    if (session.accountId) {
      getAccountInfo(session.accountId);
    }
  }, []);

  if (!session.accountId) {
    return <Navigate to="/crear-cuenta" replace />;
  }

  return (
    <Stack gap={8}>
      {/* ACCOUNT INFO */}
      <Box>
        <Typography component="h2" variant="h5">
          Información de cuenta
        </Typography>
        <Typography>
          <b>Nombre:</b> {accountInfo?.name}
        </Typography>
        <Typography>
          <b>Número:</b> {accountInfo?.number}
        </Typography>
        <Typography>
          <b>Saldo:</b> {formatMoney(accountInfo?.balance ?? 0)}
        </Typography>
      </Box>

      {/* TRANSACTIONS */}
      <Box>
        <Stack direction="row" justifyContent="space-between">
          <Typography component="h2" variant="h5">
            Transacciones
          </Typography>
          <MakeTransactionModal />
        </Stack>

        {accountInfo?.transactions.length === 0 ? (
          <Typography>Cuenta sin transacciones</Typography>
        ) : (
          <TransactionsTable />
        )}
      </Box>
    </Stack>
  );
};
