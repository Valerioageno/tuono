import * as React from 'react'
import { getRouterContext } from './RouterContext'
import { Matches } from './Matches'

type Router = any

interface RouterContextProviderProps {
  router: Router
  children: ReactNode
}

function RouterContextProvider({
  router,
  children,
  ...rest
}: RouterContextProviderProps): JSX.Element {
  // Allow the router to update options on the router instance
  router.update({
    ...router.options,
    ...rest,
    context: {
      ...router.options.context,
      ...rest.context,
    },
  })

  const routerContext = getRouterContext()

  const pendingElement = router.options.defaultPendingComponent ? (
    <router.options.defaultPendingComponent />
  ) : null

  const provider = (
    <React.Suspense fallback={pendingElement}>
      <routerContext.Provider value={router}>{children}</routerContext.Provider>
    </React.Suspense>
  )

  // NOTE: verify usefulness
  if (router.options.Wrap) {
    return <router.options.Wrap>{provider}</router.options.Wrap>
  }

  return provider
}

interface RouterProviderProps {
  router: Router
}

export function RouterProvider({
  router,
  ...rest
}: RouterProviderProps): JSX.Element {
  return (
    <RouterContextProvider router={router} {...rest}>
      <Matches />
    </RouterContextProvider>
  )
}
