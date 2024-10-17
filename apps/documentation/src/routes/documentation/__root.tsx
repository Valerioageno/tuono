import type { ReactNode } from 'react'
import { AppShell, Container } from '@mantine/core'
import MdxProvider from '../../components/mdx-provider'
import EditPage from '../../components/edit-page'

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
			</Container>
		</AppShell.Main>
	)
}
