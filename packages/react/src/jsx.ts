import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import type { Type, Key, Ref, Props, ReactElement, ElementType } from 'shared/ReactTypes';

// ReactElement
const createElement = function (type: Type, key: Key, ref: Ref, props: Props): ReactElement {
  const element: ReactElement = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'custom_react'
  };

  return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  if (config != null) {
    for (const prop in config) {
      const val = config[prop];
      if (prop === 'key') {
        if (val !== undefined) {
          key = '' + val;
        }
        continue;
      }
      if (prop === 'ref') {
        if (val !== undefined) {
          ref = val;
        }
        continue;
      }
      if ({}.hasOwnProperty.call(config, prop)) {
        props[prop] = val;
      }
    }
  }
  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }

  return createElement(type, key, ref, props);
};

export const jsxDEV = jsx;
