import * as React from 'react'
import type { Route } from '../route'
import { useServerSideProps } from '../hooks/useServerSideProps'

interface MatchProps {
  route: Route
  // User defined server side props
  serverSideProps: any
}

/**
 * Returns the route match with the root element if exists
 *
 * It handles the fetch of the client side resources
 */
export const RouteMatch = ({
  route,
  serverSideProps,
}: MatchProps): JSX.Element => {
  const { data, isLoading } = useServerSideProps(route, serverSideProps)

  if (!route.isRoot) {
    const Root = route.options.getParentRoute()
    return (
      <Root.component data={data} isLoading={isLoading}>
        <React.Suspense>
          <route.options.component data={data} isLoading={isLoading} />
        </React.Suspense>
      </Root.component>
    )
  }

  return (
    <React.Suspense>
      <route.options.component data={data} isLoading={isLoading} />
    </React.Suspense>
  )
}
