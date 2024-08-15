import { Text, type TextProps } from '@mantine/core'

export default function MdxBold(props: TextProps): JSX.Element {
  return <Text fw={700} {...props} />
}
