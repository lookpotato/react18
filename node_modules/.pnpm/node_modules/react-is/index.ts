export function isValidElement(object: any) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === Symbol.for('react.element')
  );
}

// 后续可以根据需要添加其他方法 