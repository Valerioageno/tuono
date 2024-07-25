import { AppShell, Burger, Flex } from '@mantine/core'
import { Link, useRouter } from 'tuono'
import ThemeBtn from '../theme-btn'

interface NavbarProps {
  opened: boolean
  toggle: () => void
}

export default function Navbar({ opened, toggle }: NavbarProps): JSX.Element {
  const { pathname } = useRouter()
  return (
    <AppShell.Header p="sm">
      <Flex justify="space-between">
        {pathname.startsWith('/documentation') && (
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        )}
        <Link href="/">Logo</Link>
        <Link href="/documentation">Documentation</Link>
        <ThemeBtn />
      </Flex>
    </AppShell.Header>
  )
}
