import { beginWork } from "./beginWork";
import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber";
import { completeWork } from "./completeWork";
import { HostRoot } from "./workTags";
import { commitRoot, commitMutationEffects } from "./commitWork";
import { MutationMask, NoFlags } from "./fiberFlags";

let workInProgressRenderLanes: number = 0;
const NoLanes = 0;

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {});
  workInProgressRenderLanes = NoLanes;
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 调度
  const root = markUpdateFromFiberToRoot(fiber);
  if (root !== null) {
    renderRoot(root);
  }
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode as FiberRootNode;
  }
  return null;
}

function renderRoot(root: FiberRootNode) {
  // 初始化
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (e) {
      if (__DEV__) {
        console.warn('workLoop发生错误', e);
      }
      workInProgress = null;
    }
  } while (true);

  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  // wip fiber树 变成 fiberRootNode树
  commitRoot(root);
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber, workInProgressRenderLanes);
  fiber.memoizedProps = fiber.pendingProps;
  
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;
  
  do {
    completeWork(node);
    const sibling = node.sibling;
    
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
