import { MDXProvider } from '@mdx-js/react'

import MdxLink from './mdx-link'
import type { ReactNode } from 'react'

interface MdxProviderProps {
  children: ReactNode
}

export default function MdxProvider({
  children,
}: MdxProviderProps): JSX.Element {
  return (
    <MDXProvider
      components={{
        a: MdxLink,
      }}
    >
      {children}
    </MDXProvider>
  )
}
