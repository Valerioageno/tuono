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
  respectReducedMotion: true,
  fontSizes: {
    // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    xs: '16px',
    sm: '16px',
  },
  colors: {
    dark: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0c0d21',
      '#01010a',
    ],
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
