import { Action, Dispatch } from "shared/ReactTypes";  

export interface Update<State> {
  action: Action<State>;
  next: Update<State> | null;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
  dispatch: Dispatch<State> | null;
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action: action,
    next: null,
  };
}

export const createUpdateQueue = <State>(): UpdateQueue<State> => {
  return {
    shared: { pending: null },
    dispatch: null
  };
}

export const enqueueUpdate = <State>(updateQueue: UpdateQueue<State>, update: Update<State>) => {
  updateQueue.shared.pending = update;
}

export function processUpdateQueue<State>(baseState: State, updates: Update<State> | null): { memoizedState: State } {
    let newState = baseState;
    let currentUpdate = updates;

    while (currentUpdate) {
        const action = currentUpdate.action;
        // 如果 action 是函数，调用它
        newState = typeof action === 'function' 
            ? (action as (prevState: State) => State)(newState)
            : action;
        
        currentUpdate = currentUpdate.next;
    }

    return { memoizedState: newState };
}


