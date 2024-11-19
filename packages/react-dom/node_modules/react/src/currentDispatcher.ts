import { Dispatch } from 'shared/ReactTypes';

export interface Dispatcher {
  useState: <T>(initialState: T | (() => T)) => [T, Dispatch<T>];
}

const currentDispatcher: { current: Dispatcher | null } = {
  current: null
};

export const resolveDispatcher = ():Dispatcher => {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error('Invalid hook call. Hook只能在函数组件中执行resolveDispatcher()报错');
  }
  return dispatcher;
}

export default currentDispatcher;
