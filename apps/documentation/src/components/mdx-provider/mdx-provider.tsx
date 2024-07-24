import { MDXProvider } from '@mdx-js/react'

import MdxCodeHighlight from './mdx-pre'
import { Link } from 'tuono'

export default function MdxProvider({ children }): JSX.Element {
  return (
    <MDXProvider
      components={{
        a: Link,
      }}
    >
      {children}
    </MDXProvider>
  )
}
