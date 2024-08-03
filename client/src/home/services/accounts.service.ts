import { Fetcher } from "../../shared/services/fetcher";

export enum TransactionType {
  WITHDRAWAL = "WITHDRAWAL",
  DEPOSIT = "DEPOSIT",
}

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  accountId: string;
};

type CreateAccountReq = {
  name: string;
  number: number;
  balance?: number;
};

type CreateAccountRes = {
  accountId: string;
};

export type GetAccountRes = {
  id: string;
  name: string;
  number: number;
  balance: number;
  ownerId: string;
  transactions: Transaction[];
};

type MakeTransactionReq = {
  amount: number;
  type: TransactionType;
};

class AccountsService extends Fetcher {
  getAccount(accountId: string, token: string) {
    return this.get<GetAccountRes>(`/accounts/${accountId}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  createAccount(data: CreateAccountReq, token: string) {
    return this.post<CreateAccountReq, CreateAccountRes>("/accounts", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  makeTransaction(data: MakeTransactionReq, token: string) {
    return this.post<MakeTransactionReq, null>("/transactions", data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

export const accountsService = new AccountsService();
