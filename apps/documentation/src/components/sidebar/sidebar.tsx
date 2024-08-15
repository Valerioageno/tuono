import { AppShell } from '@mantine/core'
import SidebarLink from './sidebar-link'

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
      <SidebarLink href="/documentation" label="Overview" onClick={close} />
      <SidebarLink
        href="/documentation/installation"
        label="Installation"
        onClick={close}
      />
      <SidebarLink
        href="/documentation/getting-started"
        label="Getting started"
        onClick={close}
      />
      <SidebarLink label="Routing" href="/documentation/routing" defaultOpened>
        <SidebarLink
          href="/documentation/routing/intro"
          label="Project structure"
          onClick={close}
        />
      </SidebarLink>
      <SidebarLink
        label="Contributing"
        href="/documentation/contributing"
        onClick={close}
        leftSection="✨"
      />
    </AppShell.Navbar>
  )
}
