import { Title } from '@mantine/core'
import type { HTMLAttributes } from 'react'

export default function MdxTitle(
  props: HTMLAttributes<HTMLHeadingElement>,
): JSX.Element {
  return <Title {...props} order={1} />
}
