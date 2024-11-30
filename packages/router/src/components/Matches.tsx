import * as React from 'react'
import { useRouterStore } from '../hooks/useRouterStore'
import { RouteMatch } from './RouteMatch'
import NotFound from './NotFound'
import useRoute from '../hooks/useRoute'

interface MatchesProps<TServerSideProps = unknown> {
  // user defined props
  serverSideProps: TServerSideProps
}

export function Matches({ serverSideProps }: MatchesProps): React.JSX.Element {
  const location = useRouterStore((st) => st.location)

  const route = useRoute(location.pathname)

  if (!route) {
    return <NotFound />
  }

  return <RouteMatch route={route} serverSideProps={serverSideProps} />
}
