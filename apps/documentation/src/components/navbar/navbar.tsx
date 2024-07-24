import { AppShell, Box, Burger, Button, Flex } from '@mantine/core'
import ThemeBtn from '../theme-btn'
import { IconBrandGithub } from '@tabler/icons-react'

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
