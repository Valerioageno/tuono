import { getRouterContext } from './RouterContext'
import { Matches } from './Matches'
import { useRouterStore } from '../hooks/useRouterStore'
import React, { useEffect, useLayoutEffect, type ReactNode } from 'react'

type Router = any

interface RouterContextProviderProps {
  router: Router
  children: ReactNode
}

interface RouterProviderProps {
  router: Router
  serverProps?: ServerProps
}

interface ServerProps {
  router: Location
  props: any
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

  const pendingElement = router.options.defaultPendingComponent ? (
    <router.options.defaultPendingComponent />
  ) : null

  return (
    <React.Suspense fallback={pendingElement}>
      <routerContext.Provider value={router}>{children}</routerContext.Provider>
    </React.Suspense>
  )
}

const initRouterStore = (props?: ServerProps): void => {
  const updateLocation = useRouterStore((st) => st.updateLocation)

  if (typeof window === 'undefined') {
    updateLocation({
      pathname: props?.router.pathname || '',
      hash: '',
      href: '',
      searchStr: '',
    })
  }

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

const useListenUrlUpdates = (): void => {
  const updateLocation = useRouterStore((st) => st.updateLocation)

  const updateLocationOnPopStateChange = ({ target }: any): void => {
    const { pathname, hash, href, search } = target.location
    updateLocation({
      pathname,
      hash,
      href,
      searchStr: search,
      search: new URLSearchParams(search),
    })
  }
  useEffect(() => {
    window.addEventListener('popstate', updateLocationOnPopStateChange)
    return (): void => {
      window.removeEventListener('popstate', updateLocationOnPopStateChange)
    }
  }, [])
}

export function RouterProvider({
  router,
  serverProps,
}: RouterProviderProps): JSX.Element {
  initRouterStore(serverProps)

  useListenUrlUpdates()

  return (
    <RouterContextProvider router={router}>
      <Matches serverSideProps={serverProps?.props} />
    </RouterContextProvider>
  )
}
