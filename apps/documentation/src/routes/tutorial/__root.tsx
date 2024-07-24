import type { ReactNode } from 'react'
import { AppShell } from '@mantine/core'
import MdxProvider from '../../components/mdx-provider'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <>
      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
      <AppShell.Main>
        <MdxProvider>{children}</MdxProvider>
      </AppShell.Main>
    </>
  )
}
