import { AppShell, Burger, Flex } from '@mantine/core'
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
        <div>Logo</div>
        <ThemeBtn />
      </Flex>
    </AppShell.Header>
  )
}
