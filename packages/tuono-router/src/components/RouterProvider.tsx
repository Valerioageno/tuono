import { getRouterContext } from './RouterContext'
import { Matches } from './Matches'
import { useRouterStore } from '../hooks/useRouterStore'
import React, { useLayoutEffect, type ReactNode } from 'react'

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

  return (
    <React.Suspense fallback={pendingElement}>
      <routerContext.Provider value={router}>{children}</routerContext.Provider>
    </React.Suspense>
  )
}

interface RouterProviderProps {
  router: Router
  serverProps: {
    path?: string
  }
}

const initRouterStore = (): void => {
  const updateLocation = useRouterStore((st) => st.updateLocation)

  useLayoutEffect(() => {
    const { pathname, hash, href, search } = window.location
    updateLocation({
      pathname,
      hash,
      href,
      searchStr: search,
      search: new URLSearchParams(search),
    })
  }, [])
}

export function RouterProvider({
  router,
  serverProps,
  ...rest
}: RouterProviderProps): JSX.Element {
  initRouterStore()

  return (
    <RouterContextProvider router={router} {...rest}>
      <Matches serverPath={serverProps.path} />
    </RouterContextProvider>
  )
}
