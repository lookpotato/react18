import { FiberNode } from './fiber'
import { Dispatch } from 'shared/ReactTypes'

let currentlyRenderingFiber: FiberNode | null = null
export function renderWithHooks(wip: FiberNode) {
  // 赋值操作
  currentlyRenderingFiber = wip;
  const Component = wip.type;
  const props = wip.pendingProps;
  
  // 调用函数组件
  const children = Component(props);
  // 重置
  currentlyRenderingFiber = null;
  return children;
}
