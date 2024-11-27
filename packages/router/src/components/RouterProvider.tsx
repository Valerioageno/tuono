import React from 'react'
import type { ReactNode, JSX } from 'react'
import { useListenBrowserUrlUpdates } from '../hooks/useListenBrowserUrlUpdates'
import { initRouterStore } from '../hooks/useRouterStore'
import type { ServerProps } from '../types'
import { getRouterContext } from './RouterContext'
import { Matches } from './Matches'
import type { Router } from '../router'

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
    // @ts-expect-error router options do not have context as property and I was unable to find any usage of it,
    //  so is this spread required?
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    context: {
      // @ts-expect-error see previous
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

interface RouterProviderProps {
  router: Router
  serverProps?: ServerProps
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
