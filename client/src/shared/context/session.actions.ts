import { StartSessionAction } from "./session.reducer";

export enum SESSION_ACTION_TYPES {
  START_SESSION = "START_SESSION",
  SET_ACCOUNT = "SET_ACCOUNT",
  END_SESSION = "END_SESSION",
}

export const startSession = (
  payload: StartSessionAction["payload"]
): StartSessionAction => ({
  type: SESSION_ACTION_TYPES.START_SESSION,
  payload,
});
