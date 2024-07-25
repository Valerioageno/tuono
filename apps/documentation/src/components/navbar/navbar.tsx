import { AppShell, Burger, Flex } from '@mantine/core'
import { Link } from 'tuono'
import ThemeBtn from '../theme-btn'

interface NavbarProps {
  opened: boolean
  toggle: () => void
}

export default function Navbar({ opened, toggle }: NavbarProps): JSX.Element {
  return (
    <AppShell.Header p="sm">
      <Flex justify="space-between">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Link href="/">Logo</Link>
        <Link href="/documentation">Documentation</Link>
        <ThemeBtn />
      </Flex>
    </AppShell.Header>
  )
}
