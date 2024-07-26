import { AppShell, Burger, Button, Flex, Title } from '@mantine/core'
import { Link, useRouter } from 'tuono'
import Actions from './actions'

interface NavbarProps {
  opened: boolean
  toggle: () => void
}

export default function Navbar({ opened, toggle }: NavbarProps): JSX.Element {
  const { pathname } = useRouter()
  return (
    <AppShell.Header p="sm">
      <Flex justify="space-between">
        <Flex align="center" gap={8}>
          {pathname.startsWith('/documentation') && (
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          )}
          <Button component={Link} href="/" variant="transparent" p={0} fz={28}>
            Tuono
          </Button>
        </Flex>
        <Actions />
      </Flex>
    </AppShell.Header>
  )
}
