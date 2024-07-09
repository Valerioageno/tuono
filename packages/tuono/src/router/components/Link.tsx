import * as React from 'react'
import { useRouter } from '../hooks/useRouter'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'

export default function Link(
  props: AnchorHTMLAttributes<HTMLAnchorElement>,
): JSX.Element {
  const router = useRouter()

  const handleTransition = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    props.onClick?.(e)
    router.push(props.href || '')
  }

  return (
    <a {...props} onClick={handleTransition}>
      {props.children}
    </a>
  )
}
