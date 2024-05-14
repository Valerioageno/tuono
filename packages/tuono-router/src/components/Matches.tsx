import * as React from 'react'
import { useRouter } from '../hooks/useRouter'
import { useRouterStore } from '../hooks/useRouterStore'
import { RouteMatch } from './RouteMatch'
import NotFound from './NotFound'

interface MatchesProps {
  serverPath?: string
}

export function Matches({ serverPath }: MatchesProps): JSX.Element {
  const location = useRouterStore((st) => st.location)
  const router = useRouter()

  const route = router.routesById[location?.pathname || serverPath || '']

  if (!route) {
    return <NotFound />
  }

  return <RouteMatch route={route} />
}
