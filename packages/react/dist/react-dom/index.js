(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReactDOM = factory());
})(this, (function () { 'use strict';

  const FunctionComponent = 0;
  const HostRoot = 3;
  const HostComponent = 5;
  const HostText = 6;

  const NoFlags = 0b000000;
  const Placement = 0b000001;
  const Update = 0b000010;
  const ChildDeletion = 0b000100;
  const MutationMask = Placement | Update | ChildDeletion;

  class FiberNode {
      tag;
      pendingProps;
      key;
      stateNode;
      type;
      // 指向树状结构
      return;
      sibling;
      child;
      index;
      ref;
      // 作为工作单元
      memoizedProps;
      alternate;
      flags;
      updateQueue;
      subtreeFlags;
      memoizedState;
      constructor(tag, pendingProps, key) {
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
  class FiberRootNode {
      container;
      current;
      finishedWork;
      constructor(container, hostRootFiber) {
          this.container = container;
          this.current = hostRootFiber;
          hostRootFiber.stateNode = this;
          this.finishedWork = null;
      }
  }
  const createWorkInProgress = (current, pendingProps) => {
      let wip = current.alternate;
      if (wip === null) {
          // mount
          wip = new FiberNode(current.tag, pendingProps, current.key);
          wip.stateNode = current.stateNode;
          wip.alternate = current;
          current.alternate = wip;
      }
      else {
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
  };
  function createFiberFromElement(element) {
      const { type, key, props } = element;
      let fiberTag = FunctionComponent;
      if (typeof type === 'string') {
          fiberTag = HostComponent;
      }
      else if (typeof type !== 'function' && __DEV__) {
          console.warn('未实现的type类型', element);
      }
      const fiber = new FiberNode(fiberTag, props, key);
      fiber.type = type;
      return fiber;
  }

  const createUpdate = (action) => {
      return { action };
  };
  const createUpdateQueue = () => {
      return {
          shared: { pending: null },
      };
  };
  const enqueueUpdate = (updateQueue, update) => {
      updateQueue.shared.pending = update;
  };
  const processUpdateQueue = (baseState, pendingUpdate) => {
      const result = {
          memoizedState: baseState,
      };
      if (pendingUpdate !== null) {
          const action = pendingUpdate.action;
          if (action instanceof Function) {
              result.memoizedState = action(baseState);
          }
          else {
              result.memoizedState = action;
          }
      }
      return result;
  };

  const supportSymbol = typeof Symbol === 'function' && Symbol.for;
  const REACT_ELEMENT_TYPE = supportSymbol
      ? Symbol.for('react.element')
      : 0xeac7;

  function ChildReconciler(shouldTrackEffects) {
      function reconcileSingleElement(returnFiber, currentFirstChild, element) {
          const fiber = createFiberFromElement(element);
          fiber.return = returnFiber;
          return fiber;
      }
      function reconcileSingleTextNode(returnFiber, currentFirstChild, content) {
          const fiber = new FiberNode(HostText, { content }, null);
          fiber.return = returnFiber;
          return fiber;
      }
      function placeSingleChild(fiber) {
          if (shouldTrackEffects && fiber.alternate === null) {
              fiber.flags |= Placement;
          }
          return fiber;
      }
      return function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
          // 判断当前Fiber的类型
          if (typeof newChild === 'object' && newChild !== null) {
              switch (newChild.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                      return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild));
                  default:
                      if (__DEV__) {
                          console.warn('未实现的reconcile类型', newChild);
                      }
                      break;
              }
          }
          // 文本节点
          if (typeof newChild === 'string' || typeof newChild === 'number') {
              return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, newChild));
          }
          return null;
      };
  }
  const reconcileChildFibers = ChildReconciler(true);
  const mountChildFibers = ChildReconciler(false);

  function beginWork(wip, renderLanes) {
      // 比较，返回子fiberNode
      switch (wip.tag) {
          case HostRoot:
              return updateHostRoot(wip);
          case HostComponent:
              return updateHostComponent(wip);
          case HostText:
              return null;
          default:
              if (__DEV__) {
                  console.warn('beginWork未实现的类型');
              }
              break;
      }
      return null;
  }
  function updateHostRoot(wip, renderLanes) {
      const baseState = wip.memoizedState;
      const updateQueue = wip.updateQueue;
      const pending = updateQueue.shared.pending;
      updateQueue.shared.pending = null;
      const { memoizedState } = processUpdateQueue(baseState, pending);
      wip.memoizedState = memoizedState;
      const nextChildren = wip.memoizedState;
      reconcileChildren(wip, nextChildren);
      return wip.child;
  }
  function updateHostComponent(wip) {
      const nextProps = wip.pendingProps;
      const nextChildren = nextProps.children;
      reconcileChildren(wip, nextChildren);
      return wip.child;
  }
  function reconcileChildren(wip, children) {
      const current = wip.alternate;
      if (current !== null) {
          // update
          wip.child = reconcileChildFibers(wip, current?.child, children);
      }
      else {
          // mount
          wip.child = mountChildFibers(wip, null, children);
      }
  }

  // export function createInstance(type: string, props: any): Instance {
  function createInstance(type) {
      // TODO: 创建DOM
      const element = document.createElement(type);
      return element;
  }
  const appendInitialChild = (parent, child) => {
      // TODO: 添加子节点
      parent.appendChild(child);
  };
  const createTextInstance = (content) => {
      // TODO: 添加子节点
      return document.createTextNode(content);
  };
  const appendChildToContainer = appendInitialChild;

  const completeWork = (wip) => {
      // 递归中的归
      const newProps = wip.pendingProps;
      const current = wip.alternate;
      switch (wip.tag) {
          case HostComponent:
              if (current !== null && wip.stateNode) ;
              else {
                  // 1. 构建DOM
                  // 2. 将DOM插入到DOM树中
                  const instance = createInstance(wip.type);
                  appendAllChildren(instance, wip);
                  wip.stateNode = instance;
              }
              bubbleProperties(wip);
              return null;
          case HostText:
              if (current !== null && wip.stateNode) ;
              else {
                  // mount
                  const instance = createTextInstance(newProps.content);
                  wip.stateNode = instance;
              }
              bubbleProperties(wip);
              return null;
          case HostRoot:
              bubbleProperties(wip);
              return null;
          default:
              if (__DEV__) {
                  console.warn('未处理的completeWork类型', wip);
              }
              return null;
      }
  };
  function appendAllChildren(parent, wip) {
      let node = wip.child;
      while (node !== null) {
          if (node.tag === HostComponent || node.tag === HostText) {
              if (node.stateNode) {
                  appendInitialChild(parent, node.stateNode);
              }
          }
          else if (node.child !== null) {
              node.child.return = node;
              node = node.child;
              continue;
          }
          if (node === wip) {
              return;
          }
          while (node.sibling === null) {
              if (node.return === null || node.return === wip) {
                  return;
              }
              node = node.return;
          }
          node.sibling.return = node.return;
          node = node.sibling;
      }
  }
  function bubbleProperties(wip) {
      let subtreeFlags = NoFlags;
      let child = wip.child;
      while (child !== null) {
          subtreeFlags |= child.subtreeFlags;
          subtreeFlags |= child.flags;
          child.return = wip;
          child = child.sibling;
      }
      wip.subtreeFlags = subtreeFlags;
  }

  let nextEffect = null;
  const commitMutationEffects = (finishedWork) => {
      nextEffect = finishedWork;
      while (nextEffect !== null) {
          // 向下遍历
          const child = nextEffect.child;
          if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
              child !== null) {
              nextEffect = child;
          }
          else {
              // 向上遍历 DFS
              up: while (nextEffect !== null) {
                  commitMutationEffectsOnFiber(nextEffect);
                  const sibling = nextEffect.sibling;
                  if (sibling !== null) {
                      nextEffect = sibling;
                      break up;
                  }
                  nextEffect = nextEffect.return;
              }
          }
      }
  };
  function commitMutationEffectsOnFiber(finishedWork) {
      const flags = finishedWork.flags;
      if ((flags & Placement) !== NoFlags) {
          commitPlacement(finishedWork);
          finishedWork.flags &= ~Placement;
      }
  }
  function commitPlacement(finishedWork) {
      if (__DEV__) {
          console.warn('执行Placement操作', finishedWork);
      }
      // parent DOM
      const hostParent = getHostParent(finishedWork);
      // finishedWork ~~ DOM
      if (hostParent !== null) {
          appendPlacementNodeIntoContainer(finishedWork, hostParent);
      }
  }
  function getHostParent(fiber) {
      let parent = fiber.return;
      while (parent) {
          const parentTag = parent.tag;
          // HostComponent HostRoot
          if (parentTag === HostComponent) {
              return parent.stateNode;
          }
          if (parentTag === HostRoot) {
              return parent.stateNode.container;
          }
          parent = parent.return;
      }
      if (__DEV__) {
          console.warn('未找到host parent');
      }
      return null;
  }
  function appendPlacementNodeIntoContainer(finishedWork, hostParent) {
      // fiber host
      if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
          appendChildToContainer(hostParent, finishedWork.stateNode);
          return;
      }
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
  function commitRoot(root) {
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
      }
      else {
          root.current = finishedWork;
      }
  }

  let workInProgress = null;
  function prepareFreshStack(root) {
      workInProgress = createWorkInProgress(root.current, {});
  }
  function scheduleUpdateOnFiber(fiber) {
      // 调度
      const root = markUpdateFromFiberToRoot(fiber);
      if (root !== null) {
          renderRoot(root);
      }
  }
  function markUpdateFromFiberToRoot(fiber) {
      let node = fiber;
      let parent = node.return;
      while (parent !== null) {
          node = parent;
          parent = node.return;
      }
      if (node.tag === HostRoot) {
          return node.stateNode;
      }
      return null;
  }
  function renderRoot(root) {
      // 初始化
      prepareFreshStack(root);
      do {
          try {
              workLoop();
              break;
          }
          catch (e) {
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
  function performUnitOfWork(fiber) {
      const next = beginWork(fiber);
      fiber.memoizedProps = fiber.pendingProps;
      if (next === null) {
          completeUnitOfWork(fiber);
      }
      else {
          workInProgress = next;
      }
  }
  function completeUnitOfWork(fiber) {
      let node = fiber;
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

  function createContainer(container) {
      const hostRootFiber = new FiberNode(HostRoot, {}, null);
      const root = new FiberRootNode(container, hostRootFiber);
      hostRootFiber.updateQueue = createUpdateQueue();
      return root;
  }
  function updateContainer(element, root) {
      const hostRootFiber = root.current;
      const update = createUpdate(element);
      enqueueUpdate(hostRootFiber.updateQueue, update);
      scheduleUpdateOnFiber(hostRootFiber);
      return element;
  }

  function createRoot(container) {
      const root = createContainer(container);
      return {
          render(element) {
              updateContainer(element, root);
          }
      };
  }

  var ReactDOM = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createRoot: createRoot
  });

  return ReactDOM;

}));
