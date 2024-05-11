import * as React from 'react'
import { useRouter } from '../hooks/useRouter'
import { useRouterStore } from '../hooks/useRouterStore'

export function Matches(): JSX.Element | undefined {
  const matchId = useRouterStore.getState().matches[0]?.id

  //if (!matchId) return <></>

  return (
    <React.Suspense>
      <Match id={matchId} />
    </React.Suspense>
  )
}

interface MatchProps {
  id: string
}

const Match = React.memo(function ({ id }: MatchProps) {
  const location = useRouterStore((st) => st.location)
  const router = useRouter()

  console.log(router, location)

  const route = router.routesById[location?.pathname]

  if (route.options.hasHandler) {
    console.log('Has rust handler')
  }

  return route.component()
})
