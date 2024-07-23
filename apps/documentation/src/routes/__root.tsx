import type { ReactNode } from 'react'
import {
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  AppShell,
  Burger,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import '@mantine/core/styles.css'
import { Head } from 'tuono'

interface RootRouteProps {
  children: ReactNode
}

const theme = createTheme({})

export default function RootRoute({ children }: RootRouteProps): JSX.Element {
  const [opened, { toggle }] = useDisclosure()
  return (
    <>
      <Head>
        <ColorSchemeScript />
      </Head>
      <MantineProvider theme={theme}>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <div>Logo</div>
          </AppShell.Header>
          {children}
        </AppShell>
      </MantineProvider>
    </>
  )
}
