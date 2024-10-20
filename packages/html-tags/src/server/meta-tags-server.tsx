import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

interface MetaServerTagsOut {
  extract: (el: ReactNode) => void
  renderToString: () => string
}

/*
 * Why not using a class?
 * Developing this fn as class resulted in a broken server side rendering. It might
 * be because a rust v8 engine issue but I'm not sure about that.
 *
 */
export default function MetaTagsServer(): MetaServerTagsOut {
  let headElms: ReactNode

  return {
    extract(elms: ReactNode): void {
      headElms = elms
    },
    renderToString(): string {
      return renderToStaticMarkup(headElms)
    },
  }
}
