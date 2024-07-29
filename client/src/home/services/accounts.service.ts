import { Fetcher } from "../../shared/services/fetcher";

type CreateAccountReq = {
  name: string;
  number: number;
  balance?: number;
};

type CreateAccountRes = {
  accountId: string;
};

class AccountsService extends Fetcher {
  createAccount(data: CreateAccountReq, token: string) {
    return this.post<CreateAccountReq, CreateAccountRes>("/accounts", data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

export const accountsService = new AccountsService();
