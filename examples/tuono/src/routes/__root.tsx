import type { ReactNode } from 'react'
import { Link } from 'tuono'

interface RootRouteProps {
  children: ReactNode
}
export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <>
      <nav>
        Navbar: <Link>About</Link>
      </nav>
      <main>{children}</main>
    </>
  )
}
