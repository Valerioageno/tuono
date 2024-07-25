import { Blockquote, Space } from '@mantine/core'

export default function MdxQuote(props): JSX.Element {
  return (
    <>
      <Blockquote color="violet" p={8} iconSize={30} {...props} />
      <Space h="md" />
    </>
  )
}
