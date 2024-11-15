export type Container = Element | DocumentFragment;
export type Instance = any;
export type Text = any;
export type Props = any;

export function createInstance(type: string): Element {
  const element = document.createElement(type);
  return element;
}

export function createTextInstance(content: string): Text {
  return document.createTextNode(content);
}

export function appendInitialChild(
  parent: Container | Element,
  child: Element | Text
): void {
  parent.appendChild(child);
}

export function appendChildToContainer(
  container: Container,
  child: Element | Text
): void {
  container.appendChild(child);
}

