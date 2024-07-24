type UserRegisteredEventData = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export class UserRegisteredEvent {
  constructor(readonly data: UserRegisteredEventData) {}
}
