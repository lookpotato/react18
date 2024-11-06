import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbols';
import { Type, Key, Ref, Props, ReactElementType, ElementType } from '../../shared/ReactTypes';

// ReactElement
const ReactElement = function (type: Type, key: Key, ref: Ref, props: Props): ReactElementType {
  const element = {
    // The type of the element, e.g., 'div', 'span', or a component
    type: type,
    // The key is used to help React identify which items have changed, are added, or are removed
    key: key,
    // The ref is used to reference a DOM element or a class component
    ref: ref,
    // The props are the properties or attributes of the element
    props: props,
    // A special property to identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    __mark: 'KaSong'
  };

  return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val != undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val != undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    props.children = maybeChildrenLength === 1 ? maybeChildren[0] : maybeChildren;
  }

  return ReactElement(type, key, ref, props);
};

export const jsxDEV = jsx;
