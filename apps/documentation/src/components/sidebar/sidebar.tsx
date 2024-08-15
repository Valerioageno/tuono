import { AppShell } from '@mantine/core'
import SidebarLink from './SidebarLink'

export default function Sidebar({ close }: { close: () => void }): JSX.Element {
  return (
    <AppShell.Navbar p="md">
      <h3>Tutorial</h3>
      <SidebarLink
        href="/documentation/tutorial/intro"
        label="Intro"
        onClick={close}
      />
      <h3>Documentation</h3>
      <SidebarLink
        href="/documentation/installation"
        label="Installation"
        onClick={close}
      />
      <SidebarLink label="Routing" href="#required-for-focus" defaultOpened>
        <SidebarLink
          href="/documentation/routing/intro"
          label="FS routing"
          onClick={close}
        />
      </SidebarLink>
      <SidebarLink
        label="✨ Contributing"
        href="/documentation/contributing"
        onClick={close}
      />
    </AppShell.Navbar>
  )
}
