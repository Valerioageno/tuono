import type { ReactNode } from 'react'
import { AppShell, Container } from '@mantine/core'
import MdxProvider from '../../components/mdx-provider'
import Sidebar from '../../components/sidebar'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <>
      <Sidebar />
      <AppShell.Main>
        <Container>
          <MdxProvider>{children}</MdxProvider>
        </Container>
      </AppShell.Main>
    </>
  )
}
