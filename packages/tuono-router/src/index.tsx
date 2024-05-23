declare global {
  interface Window {
    __TUONO_SSR__PROPS__: any
  }
}
export { RouterProvider } from './components/RouterProvider'
export { default as Link } from './components/Link'
export { createRouter } from './router'
export { createRoute, createRootRoute, getRouteApi } from './route'
