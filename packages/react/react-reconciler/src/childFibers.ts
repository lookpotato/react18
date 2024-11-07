import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { createFiberFromElement, FiberNode } from "./fiber";
import { ReactElementType } from "shared/ReactTypes";
import { HostText } from "./workTags";
import { Placement } from "./fiberFlags";

function ChildReconciler(shouldTrackEffects: boolean) {
  function reconcileSingleElement(returnFiber: FiberNode, currentFirstChild: FiberNode | null, element: ReactElementType) {
    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function reconcileSingleTextNode(returnFiber: FiberNode, currentFirstChild: FiberNode | null, content: string | number) {
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement;
    }
    return fiber;
  }

  return function reconcileChildFibers(returnFiber: FiberNode, currentFirstChild: FiberNode | null, newChild?: ReactElementType) {
    // 判断当前Fiber的类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild)
          );
        default:
          if (__DEV__) {
            console.warn('未实现的reconcile类型', newChild);
          }
          break;
      }
    }

    // 文本节点
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFirstChild, newChild)
      );
    }

    return null;
  };
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);