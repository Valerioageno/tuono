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

  return (
    <TraverseRootComponents route={route} data={data} isLoading={isLoading} />
  )
}

interface TraverseRootComponentsProps {
  route: Route
  data: any
  isLoading: boolean
}

const TraverseRootComponents = ({
  route,
  data,
  isLoading,
}: TraverseRootComponentsProps): JSX.Element => {
  if (route.isRoot) {
    return <route.options.component data={data} isLoading={isLoading} />
  }

  const Parent = route.options.getParentRoute()

  return (
    <Parent.component data={data} isLoading={isLoading}>
      <route.options.component data={data} isLoading={isLoading} />
    </Parent.component>
  )
}
