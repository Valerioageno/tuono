import * as React from 'react'

/**
 * Helper function to lazy load any component.
 *
 * The function acts exactly like React.lazy function but also renders the component on the server.
 * If you want to just load the component client side use directly the react's lazy function.
 *
 * It works also with React.Suspense
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const lazy = (importFn: () => JSX.Element): JSX.Element => {
  /**
   *
   * This function is just a placeholder. The real work is done by the bundler.
   * The custom babel plugin will create two different bundles for the client and the server.
   *
   * The client will import the React's lazy function while the server will statically
   * import the file.
   *
   * Example:
   *
   * // User code
   * import { lazy } from 'tuono'
   * const MyComponent = lazy(() => import('./my-component'))
   *
   * // Client side generated code
   * import { lazy } from 'react'
   * const MyComponent = lazy(() => import('./my-component'))
   *
   * // Server side generated code
   * import MyComponent from './my-component'
   *
   */
  return <></>
}
