import type { ReactNode } from 'react'
import { AppShell } from '@mantine/core'
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
        <MdxProvider>{children}</MdxProvider>
      </AppShell.Main>
    </>
  )
}
