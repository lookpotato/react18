export type Container = any;
export type Instance = any;
export type Text = any;
export type Props = any;

export function createInstance(type: string, props: any): Instance {
  // TODO: 创建DOM
  const element = document.createElement(type);
  return element;
}

export const appendInitialChild = (...args: any) => {
  // TODO: 添加子节点
}

export const createTextInstance = (...args: any) => {
  // TODO: 添加子节点
}

