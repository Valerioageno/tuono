import { Title } from '@mantine/core'
import { useRef, type HTMLAttributes } from 'react'

export default function MdxH2(
  props: HTMLAttributes<HTMLHeadingElement>,
): JSX.Element {
  return (
    <Title
      {...props}
      mt={20}
      order={2}
      id={String(props.children ?? '')
        .toLowerCase()
        .replaceAll(' ', '-')}
    />
  )
}
