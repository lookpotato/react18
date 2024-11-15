# React 18 源码实现

这是一个从零开始实现 React 18 核心功能的项目。目前正在实现 React 的核心调和（Reconciliation）过程。

## 当前进度

### 已完成
1. 项目基础搭建
   - 使用 pnpm workspace 管理项目
   - 配置 Rollup 构建系统
   - TypeScript 支持

2. React 包的基础结构
   - JSX 运行时支持
   - React.createElement 实现

3. Reconciler（调和器）初步实现
   - Fiber 节点数据结构
   - FiberRootNode 实现
   - UpdateQueue 机制
   - 初始化容器的能力

### 正在进行
1. Reconciler 核心功能
   - workLoop 工作循环实现
   - scheduleUpdateOnFiber 调度更新
   - Fiber 树的构建

### 待实现
1. 完整的调和过程
2. 渲染器
3. 调度系统
4. Hooks 系统
5. 并发特性

## 项目结构

