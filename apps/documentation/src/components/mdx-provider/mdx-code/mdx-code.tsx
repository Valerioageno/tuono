import type { JSX } from 'react'
import { Code } from '@mantine/core'
import type { HTMLAttributes } from 'react'

export default function MdxCode(
  props: HTMLAttributes<HTMLPreElement>,
): JSX.Element {
  return <Code {...props} style={{ fontSize: 14 }} />
}
