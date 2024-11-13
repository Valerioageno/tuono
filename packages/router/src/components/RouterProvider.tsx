import React from 'react'
import type { ReactNode, JSX } from 'react'
import { useListenBrowserUrlUpdates } from '../hooks/useListenBrowserUrlUpdates'
import { initRouterStore } from '../hooks/useRouterStore'
import type { ServerProps } from '../types'
import { getRouterContext } from './RouterContext'
import { Matches } from './Matches'

type Router = any

interface RouterContextProviderProps {
  router: Router
  children: ReactNode
}

interface RouterProviderProps {
  router: Router
  serverProps?: ServerProps
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
    },
  })

  const routerContext = getRouterContext()

  return (
    <React.Suspense>
      <routerContext.Provider value={router}>{children}</routerContext.Provider>
    </React.Suspense>
  )
}

export function RouterProvider({
  router,
  serverProps,
}: RouterProviderProps): JSX.Element {
  initRouterStore(serverProps)

  useListenBrowserUrlUpdates()

  return (
    <RouterContextProvider router={router}>
      <Matches serverSideProps={serverProps?.props} />
    </RouterContextProvider>
  )
}
