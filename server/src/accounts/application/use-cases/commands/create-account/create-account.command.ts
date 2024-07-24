type CreateAccountCommandProps = {
  name: string;
  number: number;
  balance?: number;
  ownerId: string;
};

export class CreateAccountCommand {
  constructor(readonly data: CreateAccountCommandProps) {}
}
