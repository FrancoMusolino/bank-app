import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import {
  SessionAction,
  sessionInitialState,
  sessionReducer,
  SessionState,
} from "./session.reducer";

type SessionContextType = {
  dispatch: React.Dispatch<SessionAction>;
  session: SessionState;
};

const SessionContext = createContext({} as SessionContextType);

type SessionProviderProps = PropsWithChildren;

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [state, dispatch] = useReducer(sessionReducer, sessionInitialState);

  return (
    <SessionContext.Provider value={{ dispatch, session: state }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error(
      "Session Context must be used inside a Session Context Provider"
    );
  }

  return context;
};
