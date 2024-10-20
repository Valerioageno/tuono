import React, { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useMetaTagsContext } from './meta-tags-context'
import {
	appendChild,
	getDuplicateTitle,
	removeChild,
	getDuplicateMeta,
	getDuplicateCanonical,
	getDuplicateElementById,
} from './utils'

interface MetaTagsProps {
	children: ReactNode
}

export default function MetaTags({ children }: MetaTagsProps): ReactNode {
	const elementRef = useRef<HTMLDivElement>(null)
	const { extract } = useMetaTagsContext()
	const [isClient, setIsClient] = useState<boolean>(false)

	const handleChildrens = (): void => {
		if (extract || !children) return

		let childNodes = Array.prototype.slice.call(elementRef.current?.children)

		const head = document.head
		const headHtml = head.innerHTML

		//filter children remove if children has not been changed
		childNodes = childNodes.filter((child) => {
			return headHtml.indexOf(child.outerHTML) === -1
		})

		//create clone of childNodes
		childNodes = childNodes.map((child) => child.cloneNode(true))

		//remove duplicate title and meta from head
		childNodes.forEach((child) => {
			const tag = child.tagName.toLowerCase()
			if (tag === 'title') {
				const title = getDuplicateTitle()
				if (title.length > 0) removeChild(head, title)
			} else if (child.id) {
				// if the element has id defined remove the existing element with that id
				const elm = getDuplicateElementById(child)
				if (elm.length > 0) removeChild(head, elm)
			} else if (tag === 'meta') {
				const meta = getDuplicateMeta(child)
				if (meta.length > 0) removeChild(head, meta)
			} else if (tag === 'link' && child.rel === 'canonical') {
				const link = getDuplicateCanonical()
				if (link.length > 0) removeChild(head, link)
			}
		})

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
