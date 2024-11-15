import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, WorkTag, HostComponent } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from '../../react-dom/src/hostConfig';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';


export class FiberNode {
  tag: WorkTag;
  pendingProps: Props;
  key: Key;
  stateNode: any;
  type: any;
  // 指向树状结构
  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;
  ref: Ref | null;
  // 作为工作单元
  memoizedProps: Props | null;
  alternate: FiberNode | null;
  flags: Flags;
  updateQueue: unknown;
  subtreeFlags: Flags;
  memoizedState: any;
  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例
    this.tag = tag;
    this.pendingProps = pendingProps;
    this.key = key;
    this.stateNode = null;
    this.type = null;
    // 指向树状结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;
    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;
    this.alternate = null;
    // 副作用
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.updateQueue = null;
  }
}

export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createWorkInProgress = (current: FiberNode, pendingProps: Props): FiberNode => {
  let wip = current.alternate;
  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current;
    current.alternate = wip;
  } else {
    // update
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
    wip.subtreeFlags = NoFlags;
  }
  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  return wip;
}

export function createFiberFromElement(element: ReactElementType): FiberNode | null {
  if (element === null || element === undefined) {
    if (__DEV__) {
      console.error('createElement received null or undefined element')
    }
    return null
  }

  const { type, props, $$typeof } = element

  // 添加更详细的类型检查
  if (!$$typeof || $$typeof !== REACT_ELEMENT_TYPE) {
    if (__DEV__) {
      console.error('Invalid React element type', element)
    }
    return null
  }

  if (type === undefined) {
    if (__DEV__) {
      console.error('Element type is undefined', element)
    }
    return null
  }

  let fiberTag: WorkTag

  if (typeof type === 'function') {
    fiberTag = FunctionComponent
  } else if (typeof type === 'string') {
    fiberTag = HostComponent
  } else {
    if (__DEV__) {
      console.error('未实现的type类型', element)
    }
    return null
  }

  const fiber = new FiberNode(fiberTag, props, null)
  fiber.type = type
  return fiber
}
