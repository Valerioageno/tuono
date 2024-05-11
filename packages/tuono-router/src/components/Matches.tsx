import * as React from 'react'
import { useRouter } from '../hooks/useRouter'
import { useRouterStore } from '../hooks/useRouterStore'
import NotFound from './NotFound'

export const Matches = React.memo(function () {
  const location = useRouterStore((st) => st.location)
  const router = useRouter()

  const route = router.routesById[location?.pathname || '']

  if (!route) {
    return <NotFound />
  }

  if (route.options.hasHandler) {
    console.log('Has rust handler')
  }

  return route.options.component()
})
