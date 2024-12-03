import type { JSX } from 'react'
import { AppShell, Burger, Button, Flex } from '@mantine/core'
import { Link } from 'tuono'

import Actions from './actions'

interface NavbarProps {
  opened: boolean
  toggle: () => void
}

export default function Navbar({ opened, toggle }: NavbarProps): JSX.Element {
  return (
    <AppShell.Header p="sm">
      <Flex justify="space-between">
        <Button component={Link} href="/" variant="transparent" p={0} fz={28}>
          Tuono
        </Button>
        <Flex align="center" gap={8}>
          <Actions />
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Flex>
      </Flex>
    </AppShell.Header>
  )
}
