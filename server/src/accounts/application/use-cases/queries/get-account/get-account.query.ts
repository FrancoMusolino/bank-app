type GetAccountQueryProps = {
  accountId: string;
};

export class GetAccountQuery {
  constructor(readonly data: GetAccountQueryProps) {}
}
