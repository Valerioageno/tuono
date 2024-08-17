import type { ReactNode } from 'react'
import { AppShell, Container } from '@mantine/core'
import MdxProvider from '../../components/mdx-provider'
import EditPage from '../../components/edit-page'
import TableOfContents from '../../components/table-of-content'

import '@mantine/code-highlight/styles.css'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <AppShell.Main>
      <Container size="lg" p={20} display={{ lg: 'flex' }}>
        <Container id="mdx-root" component="article" size="md" p={0}>
          <MdxProvider>{children}</MdxProvider>
          <EditPage />
        </Container>
        <Container size="xs" visibleFrom="lg" p={0}>
          <TableOfContents withTabs={false} />
        </Container>
      </Container>
    </AppShell.Main>
  )
}
