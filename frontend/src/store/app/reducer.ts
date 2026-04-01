import { AppAction, AppState, initialAppState } from "./app";

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_AUTH":
      return { ...state, isAuthenticated: action.payload };
    case "RESET":
      return { ...initialAppState, isAuthenticated: false };
    case "SET_EMAIL_JOIN_US":
      return { ...state, emailJoinUs: action.payload };
    default:
      return state;
  }
};
