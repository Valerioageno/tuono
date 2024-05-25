import { useRouter } from '../hooks/useRouter'
import { useRouterStore } from '../hooks/useRouterStore'
import { RouteMatch } from './RouteMatch'
import NotFound from './NotFound'

interface MatchesProps {
  // user defined props
  serverSideProps: any
}

export function Matches({ serverSideProps }: MatchesProps): JSX.Element {
  const location = useRouterStore((st) => st.location)
  const router = useRouter()

  const route = router.routesById[location.pathname]

  if (!route) {
    return <NotFound />
  }

  return <RouteMatch route={route} serverSideProps={serverSideProps} />
}
