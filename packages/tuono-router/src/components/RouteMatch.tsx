import type { Route } from '../route'

interface MatchProps {
  route: Route
}

/**
 * Returns the route match with the root element if exists
 */
export const RouteMatch = ({ route }: MatchProps): JSX.Element => {
  if (route.options.hasHandler) {
    console.log('Has rust handler')
  }

  if (!route.isRoot) {
    console.log(route.options)
    return route.options.getParentRoute().component({
      children: route.options.component(),
    })
  }

  return route.options.component()
}
