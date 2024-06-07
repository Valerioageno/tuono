import { useRouterStore } from '../hooks/useRouterStore'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'

export default function Link(
  props: AnchorHTMLAttributes<HTMLAnchorElement>,
): JSX.Element {
  const handleTransition = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    props.onClick?.(e)
    useRouterStore.setState({ location: { pathname: props.href || '' } })
    history.pushState(props.href, '', props.href)
  }
  return (
    <a {...props} onClick={handleTransition}>
      {props.children}
    </a>
  )
}
