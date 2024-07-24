type RegisterUserCommandProps = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export class RegisterUserCommand {
  constructor(readonly data: RegisterUserCommandProps) {}
}
