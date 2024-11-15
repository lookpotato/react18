
import { Action } from "shared/ReactTypes";

export interface Dispatcher {
  useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>];
}


export type Dispatch<State> = (action: Action<State>) => void;

const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

export const resolveDispatcher = () => {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error('Dispatcher was null when trying to resolve it.');
  }
  return dispatcher;
};

export default currentDispatcher;
