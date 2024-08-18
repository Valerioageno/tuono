import { Title, type TitleProps } from '@mantine/core'

export default function MdxTitle(props: TitleProps): JSX.Element {
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
  (props: TitleProps): JSX.Element => <MdxTitle order={order} {...props} />
