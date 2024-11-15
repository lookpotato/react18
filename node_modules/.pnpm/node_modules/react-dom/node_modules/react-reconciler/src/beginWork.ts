import { ReactElementType, Type } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { UpdateQueue, processUpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText, FunctionComponent } from "./workTags";
import { mountChildFibers, reconcileChildFibers } from "./childFibers";
import { renderWithHooks } from './fiberHooks';
import { createInstance } from '../../react-dom/src/hostConfig'

// 定义 renderLanes 类型
type RenderLanes = number;

export function beginWork(wip: FiberNode, renderLanes: RenderLanes) {
  // 比较，返回子fiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip, renderLanes);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip);
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型');
      }
      break;
  }
  return null;
}

function updateHostRoot(wip: FiberNode, renderLanes: RenderLanes) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  if (!wip.stateNode) {
    wip.stateNode = createInstance(wip.type)
    
    // 处理 props
    for (const prop in wip.pendingProps) {
      if (prop !== 'children') {
        // 设置 DOM 属性
        wip.stateNode[prop] = wip.pendingProps[prop]
      }
    }
  }

  const nextChildren = wip.pendingProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate;

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children);
  }
}

function updateFunctionComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = renderWithHooks(wip);

  reconcileChildren(wip, nextChildren);
  return wip.child;
}
