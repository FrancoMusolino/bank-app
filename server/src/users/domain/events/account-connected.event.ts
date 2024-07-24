type AccountConnectedEventData = {
  userId: string;
  accountId: string;
};

export class AccountConnectedEvent {
  constructor(readonly data: AccountConnectedEventData) {}
}
