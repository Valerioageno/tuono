import type { ReactNode } from 'react'
import {
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  AppShell,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Head } from 'tuono'
import Navbar from '../components/navbar'

import '@mantine/core/styles.css'
import '@mantine/code-highlight/styles.css'

interface RootRouteProps {
  children: ReactNode
}

const theme = createTheme({
  primaryColor: 'violet',
  primaryShade: { light: 6, dark: 8 },
  fontFamily: 'Roboto',
  fontSizes: {
    // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    xs: '16px',
    sm: '16px',
  },

  headings: {
    sizes: {
      h1: {
        fontSize: '48px',
      },
    },
  },
})

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
        >
          <Navbar opened={opened} toggle={toggle} />
          {children}
        </AppShell>
      </MantineProvider>
    </>
  )
}