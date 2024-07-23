import type { ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { AppShell } from '@mantine/core'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <>
      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
      <AppShell.Main>
        <MDXProvider>{children}</MDXProvider>
      </AppShell.Main>
    </>
  )
}
