import type { ReactNode } from 'react'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <>
      <h1>Base root</h1>
      <main className="main">{children}</main>
    </>
  )
}
