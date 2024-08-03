import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { Transaction, TransactionType } from "../services/accounts.service";
import { formatMoney } from "../../shared/utils";

const columns: GridColDef[] = [
  {
    field: "type",
    headerName: "Tipo",
    width: 160,
    valueFormatter: (type: TransactionType) =>
      type === TransactionType.DEPOSIT ? "Depósito" : "Retiro",
  },
  {
    field: "amount",
    headerName: "Monto",
    width: 160,
    valueFormatter: (amount: number) => formatMoney(amount),
  },
  {
    field: "date",
    headerName: "Fecha",
    type: "dateTime",
    width: 160,
    valueGetter: (value, row) => {
      console.log({ value, row });
      return new Date();
    },
  },
];

type TransactionsTableProps = {
  transactions: Transaction[];
};

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableColumnSorting
      />
    </div>
  );
};
