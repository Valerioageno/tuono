import type { HTMLProps } from 'react'
import { Link } from 'tuono'

export default function MdxLink(
  props: HTMLProps<HTMLAnchorElement>,
): JSX.Element {
  if (props.href?.startsWith('http')) {
    return <a {...props} target="_blank" />
  }
  return <Link {...props} />
}
