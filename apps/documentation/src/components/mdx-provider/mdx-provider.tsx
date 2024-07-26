import { MDXProvider } from '@mdx-js/react'

import MdxLink from './mdx-link'
import type { ReactNode } from 'react'
import MdxPre from './mdx-pre'
import MdxQuote from './mdx-quote'
import MdxCode from './mdx-code'
import MdxTitle from './mdx-title'

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
        // @ts-expect-error: useless finding the correct props types
        pre: MdxPre,
        blockquote: MdxQuote,
        code: MdxCode,
        h1: MdxTitle,
      }}
    >
      {children}
    </MDXProvider>
  )
}
