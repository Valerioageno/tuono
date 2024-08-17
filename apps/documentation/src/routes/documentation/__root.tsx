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
      <Container p={20} size="lg">
        <Flex>
          <Container id="mdx-root" component="article">
            <MdxProvider>{children}</MdxProvider>
            <EditPage />
          </Container>
          <Container size="xs">
            <TableOfContents withTabs={false} />
          </Container>
        </Flex>
      </Container>
    </AppShell.Main>
  )
}
