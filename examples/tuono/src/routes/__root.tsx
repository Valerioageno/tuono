import type { ReactNode } from 'react'

interface RootRouteProps {
  children: ReactNode
}
export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <>
      <main className="main">{children}</main>
    </>
  )
}
