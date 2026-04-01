import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ReducerAction, ReducerStore } from "../store";
import { appReducer } from "./reducer";

export interface AppState {
  isAuthenticated: boolean | undefined;
  emailJoinUs: string;
}

export type AppAction =
  | ReducerAction<"SET_AUTH", boolean>
  | ReducerAction<"RESET">
  | ReducerAction<"SET_EMAIL_JOIN_US", string>;

export const initialAppState: AppState = {
  isAuthenticated: undefined,
  emailJoinUs: "",
};

export const useAppStore = create<ReducerStore<AppState, AppAction>>()(
  immer((set) => ({
    state: initialAppState,

    dispatch: (action: AppAction) =>
      set((s) => ({ state: appReducer(s.state, action) })),
  })),
);

//select dispatch
export const useAppDispatch = () => useAppStore((s) => s.dispatch);

//selector state
export const selectIsAuthenticated = (s: ReducerStore<AppState, AppAction>) =>
  s.state.isAuthenticated;

export const selectEmailJoinUs = (s: ReducerStore<AppState, AppAction>) =>
  s.state.emailJoinUs;
