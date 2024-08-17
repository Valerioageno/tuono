import type { ReactNode } from 'react'
import { AppShell, Container, Flex } from '@mantine/core'
import MdxProvider from '../../components/mdx-provider'
import EditPage from '../../components/edit-page'
import TableOfContents from '../../components/table-of-content'

interface RootRouteProps {
  children: ReactNode
}

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  return (
    <AppShell.Main>
      <Container size="lg" p={5}>
        <Flex>
          <Container id="mdx-root" component="article">
            <MdxProvider>{children}</MdxProvider>
            <EditPage />
          </Container>
          <Container size="xs" visibleFrom="lg">
            <TableOfContents withTabs={false} />
          </Container>
        </Flex>
      </Container>
    </AppShell.Main>
  )
}
