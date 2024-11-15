import { FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { appendChildToContainer, Container } from "../../react-dom/src/hostConfig";
import { HostComponent, HostRoot, HostText, FunctionComponent } from "./workTags";

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
  commitMutationEffectsOnFiber(finishedWork);
};

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
  const flags = finishedWork.flags;

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }

  // 递归处理子节点
  let child = finishedWork.child;
  while (child !== null) {
    commitMutationEffectsOnFiber(child);
    child = child.sibling;
  }
}

function commitPlacement(finishedWork: FiberNode) {
  if (__DEV__) {
    console.log('执行Placement操作', finishedWork);
  }
  // parent DOM
  const hostParent = getHostParent(finishedWork);

  // finishedWork ~~ DOM
  if (hostParent !== null) {
    appendPlacementNodeIntoContainer(finishedWork, hostParent);
  }
}

function getHostParent(fiber: FiberNode): Container | null {
  let parent = fiber.return;

  while (parent) {
    const parentTag = parent.tag;
    if (parentTag === HostComponent) {
      return parent.stateNode as Container;
    }
    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container;
    }
    parent = parent.return;
  }
  return null;
}

function appendPlacementNodeIntoContainer(
  finishedWork: FiberNode,
  hostParent: Container
) {
  // 处理 host 组件
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(hostParent, finishedWork.stateNode);
    return;
  }

  // 处理函数组件
  if (finishedWork.tag === FunctionComponent) {
    const child = finishedWork.child;
    if (child !== null) {
      appendPlacementNodeIntoContainer(child, hostParent);
    }
    return;
  }

  // 递归处理子节点
  const child = finishedWork.child;
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent);
    let sibling = child.sibling;
    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent);
      sibling = sibling.sibling;
    }
  }
}

export function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;

  if (finishedWork === null) {
    return;
  }

  if (__DEV__) {
    console.log('commit阶段开始', finishedWork);
  }

  // 重置
  root.finishedWork = null;

  // 判断是否存在3个子阶段需要执行的操作
  const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation
    // mutation
    commitMutationEffects(finishedWork);
    root.current = finishedWork;
    // layout
  } else {
    root.current = finishedWork;
  }
}
