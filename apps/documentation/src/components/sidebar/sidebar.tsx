import { AppShell, NavLink } from '@mantine/core'
import { Link } from 'tuono'

export default function Sidebar(): JSX.Element {
  return (
    <AppShell.Navbar p="md">
      <h3>Tutorial</h3>
      <NavLink
        href="/documentation/tutorial/intro"
        component={Link}
        label="Intro"
      />
      <h3>Documentation</h3>
      <NavLink
        href="/documentation/installation"
        component={Link}
        label="Installation"
      />
      <NavLink label="Routing" href="#required-for-focus" defaultOpened>
        <NavLink
          href="/documentation/routing/intro"
          component={Link}
          label="FS routing"
        />
      </NavLink>
      <NavLink
        label="Contributing"
        component={Link}
        href="/documentation/contributing"
      />
    </AppShell.Navbar>
  )
}
