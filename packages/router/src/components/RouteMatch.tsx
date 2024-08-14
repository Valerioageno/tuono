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

  const routes = React.useMemo(() => loadParentComponents(route), [route.id])

  return (
    <TraverseRootComponents routes={routes} data={data} isLoading={isLoading}>
      <route.component data={data} isLoading={isLoading} />
    </TraverseRootComponents>
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

/*
 * This component traverses and renders
 * all the components that wraps the selected route (__root).
 * The parents components need to be memoized in order to avoid
 * re-rendering bugs when changing route.
 */
const TraverseRootComponents = React.memo(
  ({
    routes,
    data,
    isLoading,
    index = 0,
    children,
  }: TraverseRootComponentsProps): JSX.Element => {
    if (routes.length > index) {
      const Parent = React.useMemo(
        () =>
          routes[index]?.component as unknown as (
            props: ParentProps,
          ) => JSX.Element,
        [],
      )

      return (
        <Parent data={data} isLoading={isLoading}>
          <TraverseRootComponents
            routes={routes}
            data={data}
            isLoading={isLoading}
            index={index + 1}
          >
            {children}
          </TraverseRootComponents>
        </Parent>
      )
    }

    return <>{children}</>
  },
)

const loadParentComponents = (route: Route, loader: Route[] = []): Route[] => {
  const parentComponent = route.options?.getParentRoute?.()

  loader.push(parentComponent)

  if (!parentComponent.isRoot) {
    return loadParentComponents(parentComponent, loader)
  }

  return loader.reverse()
}
