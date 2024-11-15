import { jsx, jsxDEV } from './jsx'
import currentDispatcher, { Dispatcher } from './currentDispatcher'

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher
} as const

export type { Dispatcher }
export {
  jsx,
  jsxDEV
}

const React = {
  version: '0.0.0',
  createElement: jsx,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
}

export default React 