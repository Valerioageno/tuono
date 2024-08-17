import { MDXProvider } from '@mdx-js/react'

import MdxLink from './mdx-link'
import type { ReactNode } from 'react'
import MdxPre from './mdx-pre'
import MdxQuote from './mdx-quote'
import MdxCode from './mdx-code'
import { h } from './mdx-title'
import MdxBold from './mdx-bold/mdx-bold'

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
        h1: h(1),
        h2: h(2),
        h3: h(3),
        h4: h(4),
        h5: h(5),
        h6: h(6),
        strong: MdxBold,
      }}
    >
      {children}
    </MDXProvider>
  )
}
