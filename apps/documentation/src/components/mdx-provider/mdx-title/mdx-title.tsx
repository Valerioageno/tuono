import { Title } from '@mantine/core'
import type { HTMLAttributes } from 'react'

export default function MdxTitle(
  props: HTMLAttributes<HTMLHeadingElement> & { order: number },
): JSX.Element {
  return (
    <Title
      data-heading={props.children}
      data-order={props.order}
      mt={20}
      {...props}
      id={String(props.children ?? '')
        .toLowerCase()
        .replaceAll(' ', '-')}
    />
  )
}

export const h =
  (order: 1 | 2 | 3 | 4 | 5 | 6) =>
  (props: HTMLAttributes<HTMLHeadingElement>): JSX.Element => (
    <MdxTitle order={order} {...props} />
  )
