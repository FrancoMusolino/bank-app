import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useSession } from "../../shared/context/session.context";
import { accountsService, GetAccountRes } from "../services/accounts.service";
import { Box, Stack, Typography } from "@mui/material";
import { formatMoney } from "../../shared/utils";

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
        <Typography component="h2" variant="h4">
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
        <Typography component="h2" variant="h4">
          Transacciones
        </Typography>
      </Box>
    </Stack>
  );
};
