import * as React from 'react'
import { useInternalRouter } from '../hooks/useInternalRouter'
import { useRouterStore } from '../hooks/useRouterStore'
import type { Route } from '../route'
import { RouteMatch } from './RouteMatch'
import NotFound from './NotFound'

interface MatchesProps {
  // user defined props
  serverSideProps: any
}

const DYNAMIC_PATH_REGEX = /\[(.*?)\]/

/*
 * This function is also implemented on server side to match the bundle
 * file to load at the first rendering.
 *
 * File: crates/tuono_lib/src/payload.rs
 *
 * Optimizations should occour on both
 */
export function getRouteByPathname(pathname: string): Route | undefined {
  const { routesById } = useInternalRouter()

  if (routesById[pathname]) return routesById[pathname]

  const dynamicRoutes = Object.keys(routesById).filter((route) =>
    DYNAMIC_PATH_REGEX.test(route),
  )

  if (!dynamicRoutes.length) return

  const pathSegments = pathname.split('/').filter(Boolean)

  let match = undefined

  // TODO: Check algo efficiency
  for (const dynamicRoute of dynamicRoutes) {
    const dynamicRouteSegments = dynamicRoute.split('/').filter(Boolean)

    const routeSegmentsCollector: string[] = []

    for (let i = 0; i < dynamicRouteSegments.length; i++) {
      if (
        dynamicRouteSegments[i] === pathSegments[i] ||
        DYNAMIC_PATH_REGEX.test(dynamicRouteSegments[i] || '')
      ) {
        routeSegmentsCollector.push(dynamicRouteSegments[i] ?? '')
      } else {
        break
      }
    }

    if (routeSegmentsCollector.length === pathSegments.length) {
      match = `/${routeSegmentsCollector.join('/')}`
      break
    }
  }

  if (!match) return
  return routesById[match]
}

export function Matches({ serverSideProps }: MatchesProps): JSX.Element {
  const location = useRouterStore((st) => st.location)

  const route = getRouteByPathname(location.pathname)

  if (!route) {
    return <NotFound />
  }

  return <RouteMatch route={route} serverSideProps={serverSideProps} />
}
