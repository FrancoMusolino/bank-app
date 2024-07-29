import { Action } from "../types";
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

export type StartSessionAction = Action<
  SESSION_ACTION_TYPES.START_SESSION,
  SessionState
>;

export type SetAccountAction = Action<
  SESSION_ACTION_TYPES.SET_ACCOUNT,
  Pick<SessionState, "accountId">
>;

export type EndSessionAction = Action<SESSION_ACTION_TYPES.END_SESSION>;

export type SessionAction =
  | StartSessionAction
  | SetAccountAction
  | EndSessionAction;

export const sessionReducer = (
  state: SessionState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case SESSION_ACTION_TYPES.START_SESSION: {
      return { ...state, ...action.payload };
    }

    case SESSION_ACTION_TYPES.SET_ACCOUNT: {
      return { ...state, accountId: action.payload!.accountId };
    }

    case SESSION_ACTION_TYPES.END_SESSION: {
      return sessionInitialState;
    }

    default:
      return state;
  }
};
