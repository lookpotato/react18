import { FiberRootNode } from './fiber';

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
    root.current = finishedWork;
    // layout
  } else {
    root.current = finishedWork;
  }
} 