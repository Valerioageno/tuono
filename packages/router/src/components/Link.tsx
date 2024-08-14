import * as React from 'react'
import { useRouter } from '../hooks/useRouter'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import useRoute from '../hooks/useRoute'
import { useInView } from 'react-intersection-observer'

interface TuonoLinkProps {
  preload?: boolean
}

export default function Link(
  componentProps: AnchorHTMLAttributes<HTMLAnchorElement> & TuonoLinkProps,
): JSX.Element {
  const { preload = true, ...props } = componentProps
  const router = useRouter()
  const route = useRoute(props.href)
  const { ref } = useInView({
    onChange(inView) {
      if (inView && preload) route?.component.preload()
    },
    triggerOnce: true,
  })

  const handleTransition = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    props.onClick?.(e)
    router.push(props.href || '')
  }

  return (
    <a {...props} ref={ref} onClick={handleTransition}>
      {props.children}
    </a>
  )
}
