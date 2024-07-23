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

  const routes = React.useMemo(() => {
    const components = loadParentComponents(route)
    components.push(route)
    return components
  }, [route.id])

  return (
    <TraverseRootComponents routes={routes} data={data} isLoading={isLoading} />
  )
}

interface TraverseRootComponentsProps {
  routes: Route[]
  data: any
  isLoading: boolean
  children?: React.ReactNode
  index?: number
}

interface ParentProps {
  children: React.ReactNode
  data: any
  isLoading: boolean
}

const TraverseRootComponents = ({
  routes,
  data,
  isLoading,
  index = 0,
}: TraverseRootComponentsProps): JSX.Element => {
  const Parent = React.memo(
    routes[index]?.component as unknown as (props: ParentProps) => JSX.Element,
  )

  return (
    <Parent data={data} isLoading={isLoading}>
      {Boolean(routes.length > index) && (
        <TraverseRootComponents
          routes={routes}
          data={data}
          isLoading={isLoading}
          index={index + 1}
        />
      )}
    </Parent>
  )
}

const loadParentComponents = (route: Route, loader: Route[] = []): Route[] => {
  const parentComponent = route.options?.getParentRoute?.()

  loader.push(parentComponent)

  if (!parentComponent.isRoot) {
    return loadParentComponents(parentComponent, loader)
  }

  return loader.reverse()
}
