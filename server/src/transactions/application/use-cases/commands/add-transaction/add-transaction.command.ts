type AddTransactionCommandProps = {
  amount: number;
  type: any;
  userId: string;
};

export class AddTransactionCommand {
  constructor(readonly data: AddTransactionCommandProps) {}
}
