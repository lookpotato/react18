import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';


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
  }
}