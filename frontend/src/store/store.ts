export type ReducerAction<TType extends string, TPayload = void> = [
  TPayload,
] extends [void]
  ? { type: TType }
  : { type: TType; payload: TPayload };

export type ReducerDispatch<TAction> = (action: TAction) => void;

export interface ReducerStore<TState, TAction> {
  state: TState;
  dispatch: ReducerDispatch<TAction>;
}
