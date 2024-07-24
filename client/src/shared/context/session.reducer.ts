import { SESSION_ACTION_TYPES } from "./session.actions";

export type SessionState = {
  id: string;
  firstname: string;
  lastname: string;
  token: string;
  accountId: string | null;
};

export const sessionInitialState: SessionState = {
  id: "",
  firstname: "",
  lastname: "",
  token: "",
  accountId: null,
};

export type SessionAction = { type: SESSION_ACTION_TYPES; payload: any };

export const sessionReducer = (
  state: SessionState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case SESSION_ACTION_TYPES.START_SESSION: {
      return state;
    }
    case SESSION_ACTION_TYPES.SET_ACCOUNT: {
      return state;
    }
    case SESSION_ACTION_TYPES.END_SESSION: {
      return sessionInitialState;
    }

    default:
      return state;
  }
};
