import { useRouter } from '../hooks/useRouter'
import { useRouterStore } from '../hooks/useRouterStore'
import { RouteMatch } from './RouteMatch'
import NotFound from './NotFound'

export function Matches(): JSX.Element {
  const location = useRouterStore((st) => st.location)
  const router = useRouter()

  const route = router.routesById[location.pathname]

  if (!route) {
    return <NotFound />
  }

  return <RouteMatch route={route} />
}
