import { Blockquote, Space } from '@mantine/core'
import type { HTMLAttributes } from 'react'

export default function MdxQuote(
  props: HTMLAttributes<HTMLQuoteElement>,
): JSX.Element {
  return (
    <>
      <Blockquote color="violet" p={8} iconSize={30} {...props} />
      <Space h="md" />
    </>
  )
}
