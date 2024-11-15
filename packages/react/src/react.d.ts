declare module 'react' {
  interface ReactElement {
    $$typeof: symbol | number
    type: any
    key: string | null
    props: any
  }

  // 添加内部属性的类型定义
  const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    currentDispatcher: {
      current: null | {
        useState<T>(initialState: T | (() => T)): [T, (action: T | ((prevState: T) => T)) => void]
      }
    }
  }

  export {
    ReactElement,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  }
} 