import { FiberNode, FiberRootNode } from "./fiber";
import { Container } from "../../react-dom/src/hostConfig";
import { HostRoot } from "./workTags";
import { ReactElementType } from "shared/ReactTypes";

import { 
  createUpdateQueue, 
  createUpdate, 
  enqueueUpdate,
  UpdateQueue
} from "./updateQueue";
import { scheduleUpdateOnFiber } from "./workLoop";

export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

export function updateContainer(element: ReactElementType, root: FiberRootNode) {
  const hostRootFiber = root.current;
  const update = createUpdate<ReactElementType>(element);
  enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElementType>, update);
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
}
