export type Type = any;
export type Key = string | null;
export type Ref = any;
export type Props = any;
export type ElementType = any;
export type Dispatch<State> = (action: Action<State>) => void;

export interface ReactElement {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  ref: Ref;
  props: Props;
  __mark: string;
}

export type ReactElementType = ReactElement;

export type Action<State> = State | ((prevState: State) => State);
