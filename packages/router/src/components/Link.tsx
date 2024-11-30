import * as React from 'react'
import type { AnchorHTMLAttributes } from 'react'
import { useInView } from 'react-intersection-observer'

import { useRouter } from '../hooks/useRouter'
import useRoute from '../hooks/useRoute'

interface TuonoLinkProps {
  /**
   * If "true" the route gets loaded when the link enters the viewport. Default "true"
   */
  preload?: boolean
  /**
   * If "false" the scroll offset will be kept across page navigation. Default "true"
   */
  scroll?: boolean
}

export default function Link(
  componentProps: AnchorHTMLAttributes<HTMLAnchorElement> & TuonoLinkProps,
): React.JSX.Element {
  const { preload = true, scroll = true, ...props } = componentProps
  const router = useRouter()
  const route = useRoute(props.href)
  const { ref } = useInView({
    onChange(inView) {
      if (inView && preload) route?.component.preload()
    },
    triggerOnce: true,
  })

  const handleTransition: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    props.onClick?.(e)

    if (props.href?.startsWith('#')) {
      window.location.hash = props.href
      return
    }

    router.push(props.href || '', { scroll })
  }

  return (
    <a {...props} ref={ref} onClick={handleTransition}>
      {props.children}
    </a>
  )
}
