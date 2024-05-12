import * as React from 'react'
import { useRouter } from '../hooks/useRouter'
import { useRouterStore } from '../hooks/useRouterStore'
import { RouteMatch } from './RouteMatch'
import NotFound from './NotFound'

export const Matches = React.memo(function () {
  const location = useRouterStore((st) => st.location)
  const router = useRouter()

  const route = router.routesById[location?.pathname || '']

  if (!route) {
    return <NotFound />
  }

  return <RouteMatch route={route} />
})
