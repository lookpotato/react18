import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { createFiberFromElement, FiberNode } from "./fiber";
import { ReactElementType } from "shared/ReactTypes";
import { HostText } from "./workTags";
import { Placement } from "./fiberFlags";
import { createTextInstance } from '../../react-dom/src/hostConfig'

function reconcileSingleElement(returnFiber: FiberNode, currentFirstChild: FiberNode | null, element: ReactElementType): FiberNode | null {
  const fiber = createFiberFromElement(element);
  
  if (fiber === null) {
    return null;
  }

  fiber.flags |= Placement;
  fiber.return = returnFiber;
  return fiber;
}

function reconcileSingleTextNode(returnFiber: FiberNode, currentFirstChild: FiberNode | null, content: string | number) {
  const contentString = content + ''
  const fiber = new FiberNode(HostText, { content: contentString }, null)
  fiber.stateNode = createTextInstance(contentString)
  fiber.flags |= Placement
  fiber.return = returnFiber
  return fiber
}

function reconcileChildrenArray(returnFiber: FiberNode, currentFirstChild: FiberNode | null, newChild: any[]) {
  let previousNewFiber: FiberNode | null = null;
  let resultingFirstChild: FiberNode | null = null;

  for (let i = 0; i < newChild.length; i++) {
    const child = newChild[i];
    
    if (child === null || child === undefined || child === false) {
      continue;
    }

    let newFiber: FiberNode | null = null;

    if (typeof child === 'string' || typeof child === 'number') {
      newFiber = reconcileSingleTextNode(returnFiber, null, child);
    } else if (typeof child === 'object' && child !== null) {
      if (child.$$typeof === REACT_ELEMENT_TYPE) {
        newFiber = createFiberFromElement(child);
      }
    }

    if (newFiber === null) {
      continue;
    }

    newFiber.flags |= Placement;
    newFiber.return = returnFiber;

    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }

  return resultingFirstChild;
}

export function reconcileChildFibers(returnFiber: FiberNode, currentFirstChild: FiberNode | null, newChild: any): FiberNode | null {
  if (typeof newChild === 'object' && newChild !== null) {
    if (newChild.$$typeof === REACT_ELEMENT_TYPE) {
      return reconcileSingleElement(returnFiber, currentFirstChild, newChild);
    }
  }

  if (Array.isArray(newChild)) {
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return reconcileSingleTextNode(returnFiber, currentFirstChild, newChild);
  }

  if (newChild === null || newChild === undefined) {
    return null;
  }

  if (__DEV__) {
    console.warn('未实现的reconcile类型', newChild);
  }
  return null;
}

export const mountChildFibers = reconcileChildFibers;