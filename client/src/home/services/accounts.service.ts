import { Fetcher } from "../../shared/services/fetcher";

export enum TransactionType {
  WITHDRAWAL = "WITHDRAWAL",
  DEPOSIT = "DEPOSIT",
}

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
  transactions: {
    id: string;
    type: TransactionType;
    amount: number;
    accountId: string;
  }[];
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
}

export const accountsService = new AccountsService();
