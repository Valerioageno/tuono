import type { ReactNode, JSX } from 'react'
import { Head } from 'tuono'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>"
        />
        <title>Tuono tutorial</title>
      </Head>
      <main className="main">{children}</main>
    </>
  )
}
