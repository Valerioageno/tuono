import React, { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useMetaTagsContext } from './meta-tags-context'
import { appendChild } from './utils'

interface MetaTagsProps {
  children: ReactNode
}

export default function MetaTags({ children }: MetaTagsProps): ReactNode {
  const [lastChildren, setLastChildren] = useState<ReactNode>(children)
  const elementRef = useRef<HTMLDivElement>(null)
  const { extract } = useMetaTagsContext()
  const [isClient, setIsClient] = useState<boolean>(false)

  const handleChildrens = (): void => {
    if (extract || !children) return
    if (children === lastChildren) return

    setLastChildren(children)

    const childNodes = Array.prototype.slice.call(elementRef.current?.children)

    appendChild(document.head, childNodes)
  }

  useEffect(() => {
    handleChildrens()
  }, [handleChildrens, isClient])

  useEffect(() => {
    setIsClient(true)
  }, [setIsClient])

  if (!isClient && extract) {
    extract(children)
  }

  return <div ref={elementRef}>{isClient ? children : <></>}</div>
}
