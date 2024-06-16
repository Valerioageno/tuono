import * as React from 'react'
import { useRouterStore } from '../hooks/useRouterStore'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'

export default function Link(
  props: AnchorHTMLAttributes<HTMLAnchorElement>,
): JSX.Element {
  const handleTransition = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    props.onClick?.(e)
    useRouterStore.setState({
      // TODO: Refine store update
      location: {
        href: props.href || '',
        pathname: props.href || '',
        search: undefined,
        searchStr: '',
        hash: '',
      },
    })
    history.pushState(props.href, '', props.href)
  }
  return (
    <a {...props} onClick={handleTransition}>
      {props.children}
    </a>
  )
}
