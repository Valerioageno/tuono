import type { ReactNode, JSX } from 'react'
import { AppShell, Container } from '@mantine/core'

import MdxProvider from '../../components/mdx-provider'
import EditPage from '../../components/edit-page'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <AppShell.Main>
      <Container id="mdx-root" component="article" size="md" p={20}>
        <MdxProvider>{children}</MdxProvider>
        <EditPage />
      </Container>
    </AppShell.Main>
  )
}
